import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from 'react-redux-firebase';

const Register = ({ history }) => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const firebase = useFirebase();

  const onSubmit = () => {
    if (password === confirmPassword) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(cred => {
          cred.user.updateProfile({
            displayName: displayName
          });
          history.push('/');
        })
        .catch(function(error) {
          console.log(error.code, error.message);
        });
    }
  };

  return (
    <div id='register'>
      <div className='form'>
        <div className='form__input'>
          <label>E-mail</label>
          <input
            type='email'
            name='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className='form__input'>
          <label>Display Name</label>
          <input
            type='text'
            name='name'
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
        </div>
        <div className='form__input'>
          <label>Password</label>
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className='form__input'>
          <label>Confirm Password</label>
          <input
            type='password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className='btn--white-text' onClick={onSubmit}>
          Create Account
        </button>
        <p>
          By creating an account you agree to our{' '}
          <Link to='/about'> Privacy Policy.</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
