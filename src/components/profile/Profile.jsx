import React from 'react';

const Profile = () => {
  return (
    <main id='profile'>
      <h1>Profile</h1>
      <div className='form'>
        <div className='form-input'>
          <label>Squat</label>
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

export default Profile;
