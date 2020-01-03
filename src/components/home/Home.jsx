import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Home = props => {
  return (
    <div className='home'>
      <div className='logo-container'>
        <img src='img/logos/logo.jpg' alt='The Strength Movement' />
      </div>
      {props.authenticated ? (
        <div className='home__menu-grid'>
          <Link to='/profile'>
            <div className='home__menu-grid__menu-button'>Profile</div>
          </Link>
          <Link to='/workout'>
            <div className='home__menu-grid__menu-button'>Workout Plan</div>
          </Link>
        </div>
      ) : null}
      <div className='home__about'>
        <Link to='/about'>Privacy Policy</Link>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  authenticated: state.firebase.auth.uid
});

export default connect(mapStateToProps)(Home);
