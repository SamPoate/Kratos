import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';

const AdminArea = props => {
  const [adminEmail, setAdminEmail] = useState('');
  const [addAdminResponse, setAddAdminResponse] = useState('');

  const addAdmin = () => {
    const addAdmin = props.firebase.functions().httpsCallable('addAdminRole');
    addAdmin({ email: adminEmail })
      .then(result => {
        setAddAdminResponse(result.data.errorInfo.message);
      })
      .catch(err => console.log(err));
  };

  return (
    <main id='admin_area'>
      <h1>ADMIN AREA</h1>
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
      <p>{addAdminResponse}</p>
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
