import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useFirebase } from 'react-redux-firebase';

const Navbar = props => {
  const [admin, setAdmin] = useState(false);
  const [checked, setChecked] = useState(false);
  const firebase = useFirebase();

  const checkAdmin = () => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        setAdmin(
          idTokenResult.claims.admin ? idTokenResult.claims.admin : false
        );
      }
    });
  };

  checkAdmin();

  return (
    <nav className='header'>
      <Link className='logo' to='/' onClick={() => setChecked(false)}>
        TSM
        {/* <img src='img/logos/logo.jpg' alt='The Strength Movement' /> */}
      </Link>
      <input
        className='menu-btn'
        type='checkbox'
        id='menu-btn'
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <label className='menu-icon' htlmfor='menu-btn'>
        <span className='navicon'></span>
      </label>
      <ul className='menu'>
        <li onClick={() => setChecked(false)}>
          <Link to='/'>Home</Link>
        </li>
        {props.authenticated ? (
          <>
            <li onClick={() => setChecked(false)}>
              <Link to='/workout'>Workout Plan</Link>
            </li>
            <li onClick={() => setChecked(false)}>
              <Link to='/profile'>Profile</Link>
            </li>
            {admin ? (
              <li onClick={() => setChecked(false)}>
                <Link to='/admin-area'>Admin</Link>
              </li>
            ) : null}
            <li onClick={() => setChecked(false)}>
              <Link to='/logout'>Logout</Link>
            </li>
          </>
        ) : (
          <li onClick={() => setChecked(false)}>
            <Link to='/login'>Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

const mapStateToProps = state => ({
  authenticated: state.firebase.auth.uid
});

export default connect(mapStateToProps)(Navbar);
