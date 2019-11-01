import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, authenticated, path, exact }) => {
  return (
    <Route
      path={path}
      exact={exact}
      render={props =>
        authenticated ? <Component {...props} /> : <Redirect to='/' />
      }
    />
  );
};

const mapStateToProps = state => ({
  authenticated: state.firebase.auth.uid
});

export default connect(mapStateToProps)(PrivateRoute);
