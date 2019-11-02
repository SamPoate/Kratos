import React, { useState } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Redirect, Route } from 'react-router-dom';
import { useFirebase } from 'react-redux-firebase';

const AdminRoute = ({ component: Component, authenticated, path, exact }) => {
  const [admin, setAdmin] = useState(false);
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
    <Route
      path={path}
      exact={exact}
      render={props =>
        admin && authenticated ? <Component {...props} /> : <Redirect to='/' />
      }
    />
  );
};

const mapStateToProps = state => ({
  authenticated: state.firebase.auth.uid
});

export default connect(mapStateToProps)(AdminRoute);
