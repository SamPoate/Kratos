import React from 'react';
import { connect } from 'react-redux';

const Profile = props => {
  return (
    <main id='profile'>
      <h1>Profile</h1>
      <div className='form'>
        <div className='form-input'>
          <label>Squat {props.profile}</label>
          <input type='text' />
        </div>
        <div className='form-input'>
          <label>Bench Press</label>
          <input type='text' />
        </div>
        <div className='form-input'>
          <label>Deadlift</label>
          <input type='text' />
        </div>
        <button className='submit' type='submit'>
          Submit
        </button>
      </div>
    </main>
  );
};

const mapStateToProps = state => ({
  todos: state.firestore.ordered.todos
});

export default connect(mapStateToProps)(Profile);
