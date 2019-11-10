import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useFirebase, isEmpty, isLoaded } from 'react-redux-firebase';
import Loading from '../layout/Loading';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Login = ({ auth, history }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const firebase = useFirebase();

  const onLogin = values => {
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(values.email, values.password)
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
        <>
          <Formik
            initialValues={{ email: '', password: '' }}
            validate={values => {
              const errors = {};
              if (!values.email) {
                errors.email = 'Required';
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = 'Invalid email address';
              }
              if (!values.password) {
                errors.password = 'Required';
              }
              return errors;
            }}
            onSubmit={values => onLogin(values)}
          >
            <Form className='form'>
              <div className='form-input'>
                <label>Email</label>
                <Field type='text' name='email' autocomplete='email' />
                <ErrorMessage name='email' component='span' />
              </div>
              <div className='form-input'>
                <label>Password</label>
                <Field type='password' name='password' />
                <ErrorMessage name='password' component='span' />
              </div>
              <p>{errorMessage}</p>
              <button
                type='submit'
                className='btn--white-text'
                disabled={loading}
              >
                Login
              </button>
            </Form>
          </Formik>
          <button className='btn--white-text'>
            <Link to='/register'>Register</Link>
          </button>
        </>
      ) : null}
    </main>
  );
};

const mapStateToProps = state => ({
  auth: state.firebase.auth
});

export default connect(mapStateToProps)(Login);
