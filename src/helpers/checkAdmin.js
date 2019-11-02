// import { useFirebase } from 'react-redux-firebase';

// export const checkAdmin = props => {

//   const admin = firebase.auth().onAuthStateChanged(user => {
//     if (user) {
//       user.getIdTokenResult().then(idTokenResult => {
//         console.log(idTokenResult.claims.admin);
//         return idTokenResult.claims.admin;
//       });
//     } else {
//       props.history.push('/');
//     }
//   });

//   return admin;
// };
