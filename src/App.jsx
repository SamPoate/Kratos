import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './helpers/authCheck';

import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { Provider } from 'react-redux';
import { store, rrfProps } from './store';
import './scss/main.scss';

import Navbar from './components/layout/Navbar';
import Home from './components/home/Home';
import Workout from './components/workout/Workout';
import Profile from './components/profile/Profile';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';

function App() {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <Router>
          <div className='App'>
            <Navbar />
            <div className='container'>
              <Switch>
                <Route exact path='/' component={Home} />
                <PrivateRoute exact path='/workout' component={Workout} />
                <PrivateRoute exact path='/profile' component={Profile} />
                <PrivateRoute exact path='/logout' component={Logout} />
                <Route exact path='/login' component={Login} />
              </Switch>
            </div>
          </div>
        </Router>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default App;
