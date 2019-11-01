import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useFirebase, isEmpty, isLoaded } from 'react-redux-firebase';
import Loading from '../layout/Loading';

const Login = ({ auth, history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setLoading(false);
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
          <button className='btn--white-text' onClick={onLogin}>
            Login
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
