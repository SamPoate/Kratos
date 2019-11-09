import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='home'>
      <div className='logo-container'>
        <img src='img/logos/logo.jpg' alt='The Strength Movement' />
      </div>
      <div className='about'>
        <Link to='/about'>Privacy Policy</Link>
      </div>
    </div>
  );
};

export default Home;
