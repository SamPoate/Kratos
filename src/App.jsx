import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './scss/main.scss';

import Navbar from './components/layout/Navbar';
import Home from './components/home/Home';
import Workout from './components/workout/Workout';
import Profile from './components/profile/Profile';

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />
        <div className='container'>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/workout' component={Workout} />
            <Route exact path='/profile' component={Profile} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
