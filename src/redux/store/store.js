import { createStore, applyMiddleware, compose } from 'redux';
import { getFirebase } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import * as Sentry from '@sentry/browser';
import createSentryMiddleware from 'redux-sentry-middleware';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';

if (process.env.NODE_ENV === 'production') {
    Sentry.init({
        dsn: 'https://60f459282de9436c935535a18e73c21f@sentry.io/1878242'
    });
}

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize firebase instance
firebase.initializeApp(firebaseConfig);
firebase.firestore();
firebase.functions();

// react-redux-firebase config
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true
};

const middleware = [
    thunk.withExtraArgument({ getFirebase }),
    createSentryMiddleware(Sentry, {
        getUserContext: state => state.firebase.auth
    })
];
export const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : x => x
    )
);

export const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance
};
