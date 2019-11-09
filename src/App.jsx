import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './helpers/PrivateRoute';
import AdminRoute from './helpers/AdminRoute';

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
import AdminArea from './components/admin/AdminArea';
import About from './components/about/About';

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
                <AdminRoute exact path='/admin-area' component={AdminArea} />
                <PrivateRoute exact path='/logout' component={Logout} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/about' component={About} />
              </Switch>
            </div>
          </div>
        </Router>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default App;
