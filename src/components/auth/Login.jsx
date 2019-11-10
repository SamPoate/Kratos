import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useFirebase, isEmpty, isLoaded } from 'react-redux-firebase';
import Loading from '../layout/Loading';
import { Link } from 'react-router-dom';

const Login = ({ auth, history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const firebase = useFirebase();

  const onLogin = () => {
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then(() => {
        setLoading(false);
        history.push('/');
      })
      .catch(function(error) {
        setLoading(false);
        setErrorMessage(error.message);
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      });
  };

  return (
    <main id='login'>
      {!isLoaded(auth) || loading ? (
        <Loading />
      ) : isEmpty(auth) ? (
        <div className='form'>
          <div className='form-input'>
            <label>Username</label>
            <input
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className='form-input'>
            <label>Password</label>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <p>{errorMessage}</p>
          <button className='btn--white-text' onClick={onLogin}>
            Login
          </button>
          <button className='btn--white-text'>
            <Link to='/register'>Register</Link>
          </button>
        </div>
      ) : null}
    </main>
  );
};

const mapStateToProps = state => ({
  auth: state.firebase.auth
});

export default connect(mapStateToProps)(Login);
