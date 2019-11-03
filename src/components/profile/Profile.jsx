import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';

import Loading from '../layout/Loading';

const Profile = props => {
  const [squat, setSquat] = useState('');
  const [bench, setBench] = useState('');
  const [deadLift, setDeadLift] = useState('');

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
              <div>{props.volume.totalSquat}kg</div>
            </div>
            <div className='info__box'>
              <label>Bench Press</label>
              <div>{props.volume.totalBench}kg</div>
            </div>
            <div className='info__box'>
              <label>Deadlift</label>
              <div>{props.volume.totalDeadLift}kg</div>
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
  profile: state.firebase.profile,
  email: state.firebase.auth.email,
  volume: state.profile
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    null
  )
)(Profile);
