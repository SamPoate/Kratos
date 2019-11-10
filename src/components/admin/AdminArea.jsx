import React, { useState, useEffect, useCallback } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase, useFirestore } from 'react-redux-firebase';
import CSVReader from 'react-csv-reader';

const AdminArea = props => {
  const [adminEmail, setAdminEmail] = useState('');
  const [addAdminResponse, setAddAdminResponse] = useState('');
  const [workoutData, setWorkoutData] = useState([]);
  const [completed, setCompleted] = useState('');
  const [phase, setPhase] = useState('');
  const [userList, setUserList] = useState([]);
  const [userManager, setUserManager] = useState(false);
  const [userObj, setUserObj] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const firestore = useFirestore();
  const getUsers = props.firebase.functions().httpsCallable('getUserList');

  const getUserList = () => {
    getUsers()
      .then(result => {
        setUserList(result.data);
      })
      .catch(err => console.log(err));
  };

  const getList = useCallback(() => {
    getUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getList();
  }, [getList]);

  const addAdmin = () => {
    const addAdmin = props.firebase.functions().httpsCallable('addAdminRole');
    addAdmin({ email: adminEmail })
      .then(result => {
        setAddAdminResponse(result.data.errorInfo.message);
      })
      .catch(err => console.log(err));
  };

  const addUser = user => {
    const addUser = props.firebase.functions().httpsCallable('addUserRole');
    addUser({ email: user.email })
      .then(() => {
        setUserManager(false);
        getUserList();
      })
      .catch(err => console.log(err));
  };

  const removeUser = user => {
    const removeUser = props.firebase
      .functions()
      .httpsCallable('removeUserRole');

    removeUser({ uid: user.uid })
      .then(() => {
        setUserManager(false);
        getUserList();
      })
      .catch(err => console.log(err));
  };

  const deleteUser = user => {
    const deleteUser = props.firebase.functions().httpsCallable('deleteUser');

    deleteUser({ uid: user.uid })
      .then(() => {
        setUserManager(false);
        getUserList();
      })
      .catch(err => console.log(err));
  };

  const openUserManager = user => {
    setUserObj(user);
    setUserManager(true);
  };

  const handleFile = file => {
    let day = '';
    let week = '';
    const data = file.reduce((data, row) => {
      if (!row[0]) {
        return data;
      }

      if (row[0].includes('phase')) {
        setPhase(row[0].toUpperCase());
        return data;
      }

      if (row[0].includes('week')) {
        week = row[0];

        const a = { ...data, [week]: {} };

        return a;
      }

      if (row[0].includes('day')) {
        day = row[0];

        const b = {
          ...data,
          [week]: {
            ...data[week],
            [day]: []
          }
        };

        return b;
      } else {
        const c = {
          ...data,
          [week]: {
            ...data[week],
            [day]: [
              ...data[week][day],
              {
                name: row[0],
                sets: row[1],
                reps: row[2],
                total: row[3],
                percent: row[4],
                weight: row[5]
              }
            ]
          }
        };

        return c;
      }
    }, {});

    setWorkoutData(data);
  };

  const save = () => {
    firestore
      .collection('WORKOUT_PROGRAMS')
      .doc(phase)
      .set(workoutData)
      .then(() => {
        setCompleted('File Uploaded');
      });
  };

  return (
    <main id='admin_area'>
      <h1>Admin Panel</h1>
      <div className='content-container'>
        <div className='admin-nav'>
          <button onClick={() => setActiveTab(1)}>User List</button>
          <button onClick={() => setActiveTab(2)}>Add Admin</button>
          <button onClick={() => setActiveTab(3)}>Data Upload</button>
        </div>
        {activeTab === 1 ? (
          <div className='card full-width'>
            <h3>User List</h3>
            {!userManager ? (
              <div className='user-list'>
                <div className='user-list__row title'>
                  <div className='user-list__row__cell'>Email</div>
                  <div className='user-list__row__cell'>Display Name</div>
                  <div className='user-list__row__cell'>User</div>
                  <div className='user-list__row__cell'></div>
                </div>
                {userList.map((u, i) => (
                  <div key={i} className='user-list__row'>
                    <div className='user-list__row__cell'>{u.email}</div>
                    <div className='user-list__row__cell'>
                      {u.displayName ? u.displayName : 'No name set'}
                    </div>
                    <div className='user-list__row__cell'>
                      {(u.customClaims && u.customClaims.user) ||
                      (u.customClaims && u.customClaims.admin) ? (
                        <div>True</div>
                      ) : (
                        <div className='false'>False</div>
                      )}
                    </div>
                    <div className='user-list__row__cell'>
                      <button
                        className='btn--white-text'
                        onClick={() => openUserManager(u)}
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <UserManager
                setUserManager={() => setUserManager(false)}
                user={userObj}
                addUser={addUser}
                removeUser={removeUser}
                deleteUser={deleteUser}
              />
            )}
          </div>
        ) : activeTab === 2 ? (
          <div className='card'>
            <div className='form-input'>
              <label>Admin Email</label>
              <input
                type='email'
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
              />
            </div>
            <button className='submit btn--white-text' onClick={addAdmin}>
              Add Admin
            </button>
            <p className='api-response'>{addAdminResponse}</p>
          </div>
        ) : (
          <div className='card'>
            <CSVReader
              cssClass='csv-reader-input'
              label='Upload a .csv'
              onFileLoaded={handleFile}
              onError={err => console.log(err)}
            />
            <button className='submit btn--white-text' onClick={save}>
              Save
            </button>
            {completed ? (
              <div className='completed-message'>{completed}</div>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
};

const UserManager = ({
  user,
  setUserManager,
  addUser,
  removeUser,
  deleteUser
}) => {
  if (user.customClaims && user.customClaims.admin) {
    return (
      <div className='user-editor'>
        <div className='user-editor__data'>
          <div className='field'>
            <div>Email</div>
            <div>{user.email}</div>
          </div>
          <div className='field'>
            <div>Display Name</div>
            <div>{user.displayName ? user.displayName : 'No name set'}</div>
          </div>
          <div className='field'>
            <div>Last Time Online</div>
            <div>{user.lastSignIn}</div>
          </div>
          <div className='field'>
            <div>Account Disabled</div>
            <div>{user.disabled ? 'Yes' : 'No'}</div>
          </div>
          <button className='btn--white-text' onClick={setUserManager}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='user-editor'>
      <div className='user-editor__data'>
        <div className='field'>
          <div>Email</div>
          <div>{user.email}</div>
        </div>
        <div className='field'>
          <div>Display Name</div>
          <div>{user.displayName ? user.displayName : 'No name set'}</div>
        </div>
        <div className='field'>
          <div>Last Time Online</div>
          <div>{user.lastSignIn}</div>
        </div>
        <div className='field'>
          <div>Account Disabled</div>
          <div>{user.disabled ? 'Yes' : 'No'}</div>
        </div>
        {!user.customClaims || !user.customClaims.user ? (
          <div className='field claims'>
            <div>Enable User Account?</div>
            <div>
              <button className='btn--green' onClick={() => addUser(user)}>
                Enable
              </button>
            </div>
          </div>
        ) : (
          <div className='field claims'>
            <div>Disable User Account?</div>
            <div>
              <button className='btn--red' onClick={() => removeUser(user)}>
                Disable
              </button>
            </div>
          </div>
        )}
        <div className='field'>
          <div>
            Delete Account?
            <br />
            (Cannot be undone)
          </div>
          <div>
            <button className='btn--red' onClick={() => deleteUser(user)}>
              Delete
            </button>
          </div>
        </div>
        <button className='btn--white-text' onClick={setUserManager}>
          Close
        </button>
      </div>
    </div>
  );
};

export default compose(
  withFirebase,
  connect(
    null,
    null
  )
)(AdminArea);
