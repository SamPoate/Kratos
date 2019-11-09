import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase, useFirestoreConnect } from 'react-redux-firebase';

import Loading from '../layout/Loading';

const Profile = props => {
  const [squat, setSquat] = useState('');
  const [bench, setBench] = useState('');
  const [deadLift, setDeadLift] = useState('');
  useFirestoreConnect('WORKOUT_PROGRAMS');

  useEffect(() => {
    setSquat(props.profile.squat ? props.profile.squat : 0);
    setBench(props.profile.bench ? props.profile.bench : 0);
    setDeadLift(props.profile.deadLift ? props.profile.deadLift : 0);
  }, [props.profile]);

  const onSubmit = () => {
    const data = {
      squat: squat,
      bench: bench,
      deadLift: deadLift
    };

    props.firebase.updateProfile(data);
  };

  const sortType = name => {
    let workoutType;
    if (name.toLowerCase().includes('squat')) {
      workoutType = 'squat';
    } else if (name.toLowerCase().includes('bench')) {
      workoutType = 'bench';
    } else if (name.toLowerCase().includes('deadlift')) {
      workoutType = 'deadLift';
    } else {
      return null;
    }
    return workoutType;
  };

  const calcWeight = data => {
    if (data.weight) return data.weight;
    let workoutType;
    if (data.name.toLowerCase().includes('squat')) {
      workoutType = 'squat';
    } else if (data.name.toLowerCase().includes('bench')) {
      workoutType = 'bench';
    } else if (data.name.toLowerCase().includes('deadlift')) {
      workoutType = 'deadLift';
    } else {
      return '';
    }

    const percent = parseInt(data.percent);
    const weight = (parseInt(props.profile[workoutType]) / 100) * percent;
    data.weight = weight;
    data.type = workoutType;

    const formattedWeight = parseFloat(weight.toFixed(2));
    return formattedWeight;
  };

  let totalVolume = {};
  const calcTotals = () => {
    const data = props.data ? props.data.PHASE_THREE : null;
    if (!data) {
      return;
    }

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        for (const k in data[key]) {
          if (data[key].hasOwnProperty(k)) {
            const el = data[key][k];

            el.forEach(x => {
              if (!sortType(x.name)) return;

              totalVolume[sortType(x.name)] = totalVolume[sortType(x.name)]
                ? totalVolume[sortType(x.name)] +
                  x.total * parseInt(calcWeight(x))
                : 0 + x.total * parseInt(calcWeight(x));
            });
          }
        }
      }
    }
  };

  calcTotals();

  return (
    <main id='profile'>
      <h1>{props.profile.isLoaded ? `${props.email}'s ` : null}Profile</h1>
      {props.profile.isLoaded ? (
        <div className='profile__container'>
          <div className='form'>
            <div className='form-input'>
              <label>Squat</label>
              <input
                type='number'
                value={squat}
                onChange={e => setSquat(e.target.value)}
              />
            </div>
            <div className='form-input'>
              <label>Bench Press</label>
              <input
                type='number'
                value={bench}
                onChange={e => setBench(e.target.value)}
              />
            </div>
            <div className='form-input'>
              <label>Deadlift</label>
              <input
                type='number'
                value={deadLift}
                onChange={e => setDeadLift(e.target.value)}
              />
            </div>

            <button className='submit btn--white-text' onClick={onSubmit}>
              Submit
            </button>
          </div>
          <div className='info'>
            <h3>Total Volume Phase 3</h3>
            <div className='info__box'>
              <label>Squat</label>
              <div>{totalVolume.squat}kg</div>
            </div>
            <div className='info__box'>
              <label>Bench Press</label>
              <div>{totalVolume.bench}kg</div>
            </div>
            <div className='info__box'>
              <label>Deadlift</label>
              <div>{totalVolume.deadLift}kg</div>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </main>
  );
};

const mapStateToProps = state => ({
  data: state.firestore.data.WORKOUT_PROGRAMS,
  profile: state.firebase.profile,
  email: state.firebase.auth.email
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    null
  )
)(Profile);
