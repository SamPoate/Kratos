import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
        <li>
          <Link to='/workout'>Workout Plan</Link>
        </li>
        <li>
          <Link to='/profile'>Profile</Link>
        </li>
        <li>
          <Link to='/'>Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
