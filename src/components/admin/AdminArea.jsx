import React, { useState } from 'react';
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
  const firestore = useFirestore();

  const addAdmin = () => {
    const addAdmin = props.firebase.functions().httpsCallable('addAdminRole');
    addAdmin({ email: adminEmail })
      .then(result => {
        setAddAdminResponse(result.data.errorInfo.message);
      })
      .catch(err => console.log(err));
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

        <div className='card full-width'>
          <h3>User Data</h3>
        </div>
      </div>
    </main>
  );
};

export default compose(
  withFirebase,
  connect(
    null,
    null
  )
)(AdminArea);
