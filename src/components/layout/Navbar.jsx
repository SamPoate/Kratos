import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Navbar = props => {
  return (
    <nav className='header'>
      <Link className='logo' to='/'>
        TSM
        {/* <img src='img/logos/logo.jpg' alt='The Strength Movement' /> */}
      </Link>
      <input className='menu-btn' type='checkbox' id='menu-btn' />
      <label className='menu-icon' htlmfor='menu-btn'>
        <span className='navicon'></span>
      </label>
      <ul className='menu'>
        <li>
          <Link to='/'>Home</Link>
        </li>
        {props.authenticated ? (
          <>
            <li>
              <Link to='/workout'>Workout Plan</Link>
            </li>
            <li>
              <Link to='/profile'>Profile</Link>
            </li>
            <li>
              <Link to='/logout'>Logout</Link>
            </li>
          </>
        ) : (
          <li>
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
