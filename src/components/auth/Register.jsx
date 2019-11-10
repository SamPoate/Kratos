import React from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from 'react-redux-firebase';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Register = ({ history }) => {
  const firebase = useFirebase();

  const onSubmit = values => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(async cred => {
        await cred.user.updateProfile({
          displayName: values.displayName
        });
        history.push('/');
      })
      .catch(function(error) {
        console.log(error.code, error.message);
      });
  };

  return (
    <div id='register'>
      <Formik
        initialValues={{
          email: '',
          displayName: '',
          password: '',
          confirmPassword: ''
        }}
        validate={values => {
          const errors = {};
          if (!values.email) {
            errors.email = 'Required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address';
          }

          if (!values.displayName) {
            errors.displayName = 'Required';
          }

          if (!values.password) {
            errors.password = 'Required';
          } else if (values.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
          }

          if (!values.confirmPassword) {
            errors.confirmPassword = 'Required';
          } else if (values.password !== values.confirmPassword) {
            errors.confirmPassword = 'Passwords must match';
          }
          return errors;
        }}
        onSubmit={values => onSubmit(values)}
      >
        <Form className='form'>
          <div className='form__input'>
            <label>E-mail</label>
            <Field type='email' name='email' />
            <ErrorMessage name='email' component='span' />
          </div>
          <div className='form__input'>
            <label>Display Name</label>
            <Field type='text' name='displayName' />
            <ErrorMessage name='displayName' component='span' />
          </div>
          <div className='form__input'>
            <label>Password</label>
            <Field type='password' name='password' />
            <ErrorMessage name='password' component='span' />
          </div>
          <div className='form__input'>
            <label>Confirm Password</label>
            <Field type='password' name='confirmPassword' />
            <ErrorMessage name='confirmPassword' component='span' />
          </div>
          <button type='submit' className='btn--white-text'>
            Create Account
          </button>
        </Form>
      </Formik>
      <p>
        By creating an account you agree to our{' '}
        <Link to='/about'> Privacy Policy.</Link>
      </p>
    </div>
  );
};

export default Register;
