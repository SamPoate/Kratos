import React, { useState, useEffect, useCallback } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
    withFirebase,
    useFirestoreConnect,
    useFirestore
} from 'react-redux-firebase';
import { Checkbox } from 'semantic-ui-react';

import WorkoutCreator from './WorkoutCreator';

const AdminArea = props => {
    const [adminEmail, setAdminEmail] = useState('');
    const [addAdminResponse, setAddAdminResponse] = useState('');
    const [userList, setUserList] = useState([]);
    const [userManager, setUserManager] = useState(false);
    const [user, setUser] = useState({});
    const [activeTab, setActiveTab] = useState(1);
    const getUsers = props.firebase.functions().httpsCallable('getUserList');
    useFirestoreConnect('settings');
    const firestore = useFirestore();

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
        const addAdmin = props.firebase
            .functions()
            .httpsCallable('addAdminRole');
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

    const disableUser = user => {
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

    const deleteUser = selectedUser => {
        const deleteUser = props.firebase
            .functions()
            .httpsCallable('deleteUser');

        deleteUser({ uid: selectedUser.uid })
            .then(() => {
                setUserManager(false);
                getUserList();
            })
            .catch(err => console.log(err));
    };

    const openUserManager = selectedUser => {
        setUser(selectedUser);
        setUserManager(true);
    };

    let AdminPanel = UserList;
    switch (activeTab) {
        case 1:
            AdminPanel = UserList;
            break;

        case 2:
            AdminPanel = AdminManagement;
            break;

        case 3:
            AdminPanel = WorkoutCreator;
            break;

        case 4:
            AdminPanel = Settings;
            break;

        default:
            AdminPanel = () => null;
            break;
    }

    return (
        <main id='admin_area'>
            <h1>Admin Panel</h1>
            <div className='content-container'>
                <div className='admin-nav'>
                    <button onClick={() => setActiveTab(1)}>User List</button>
                    {/* <button onClick={() => setActiveTab(2)}>Add Admin</button> */}
                    <button onClick={() => setActiveTab(3)}>Data Upload</button>
                    <button onClick={() => setActiveTab(4)}>Settings</button>
                </div>
                <AdminPanel
                    userManager={userManager}
                    userList={userList}
                    openUserManager={openUserManager}
                    setUserManager={setUserManager}
                    user={user}
                    addUser={addUser}
                    removeUser={disableUser}
                    deleteUser={deleteUser}
                    adminEmail={adminEmail}
                    setAdminEmail={setAdminEmail}
                    addAdmin={addAdmin}
                    addAdminResponse={addAdminResponse}
                    settings={props.settings}
                    firestore={firestore}
                />
            </div>
        </main>
    );
};

const Settings = ({ settings, firestore }) => {
    const { phases } = settings;
    const [confirmMessage, setConfirmMessage] = useState();

    const onChange = phase => {
        firestore
            .collection('settings')
            .doc('phases')
            .set(phase)
            .then(() => {
                setConfirmMessage('Active Phases Updated');

                setTimeout(() => {
                    setConfirmMessage();
                }, 3000);
            });
    };

    return (
        <div className='card full-width settings'>
            <h3>Active Phases</h3>
            <div>
                <Checkbox
                    label='Phase 1'
                    checked={phases.phase_one.active}
                    onChange={() =>
                        onChange({
                            ...phases,
                            phase_one: { active: !phases.phase_one.active }
                        })
                    }
                    toggle
                />
                <Checkbox
                    label='Phase 2'
                    checked={phases.phase_two.active}
                    onChange={() =>
                        onChange({
                            ...phases,
                            phase_two: { active: !phases.phase_two.active }
                        })
                    }
                    toggle
                />
                <Checkbox
                    label='Phase 3'
                    checked={phases.phase_three.active}
                    onChange={() =>
                        onChange({
                            ...phases,
                            phase_three: { active: !phases.phase_three.active }
                        })
                    }
                    toggle
                />
                <Checkbox
                    label='Phase 4'
                    checked={phases.phase_four.active}
                    onChange={() =>
                        onChange({
                            ...phases,
                            phase_four: { active: !phases.phase_four.active }
                        })
                    }
                    toggle
                />
                <p>{confirmMessage}</p>
            </div>
        </div>
    );
};

const UserList = ({
    userManager,
    userList,
    openUserManager,
    setUserManager,
    user,
    addUser,
    removeUser,
    deleteUser
}) => {
    return (
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
                            <div className='user-list__row__cell'>
                                {u.email}
                            </div>
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
                    user={user}
                    addUser={addUser}
                    removeUser={removeUser}
                    deleteUser={deleteUser}
                />
            )}
        </div>
    );
};

const AdminManagement = ({
    adminEmail,
    setAdminEmail,
    addAdmin,
    addAdminResponse
}) => {
    return (
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
                        <div>
                            {user.displayName
                                ? user.displayName
                                : 'No name set'}
                        </div>
                    </div>
                    <div className='field'>
                        <div>Last Time Online</div>
                        <div>{user.lastSignIn}</div>
                    </div>
                    <div className='field'>
                        <div>Account Disabled</div>
                        <div>{user.disabled ? 'Yes' : 'No'}</div>
                    </div>
                    <button
                        className='btn--white-text'
                        onClick={setUserManager}
                    >
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
                    <div>
                        {user.displayName ? user.displayName : 'No name set'}
                    </div>
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
                            <button
                                className='btn--green'
                                onClick={() => addUser(user)}
                            >
                                Enable
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className='field claims'>
                        <div>Disable User Account?</div>
                        <div>
                            <button
                                className='btn--red'
                                onClick={() => removeUser(user)}
                            >
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
                        <button
                            className='btn--red'
                            onClick={() => deleteUser(user)}
                        >
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

const mapStateToProps = state => ({
    settings: state.firestore.data.settings
});

export default compose(withFirebase, connect(mapStateToProps, null))(AdminArea);
