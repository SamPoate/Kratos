import { useFirebase } from 'react-redux-firebase';
import { withRouter } from 'react-router-dom';

const Logout = props => {
  const firebase = useFirebase();

  firebase
    .auth()
    .signOut()
    .then(() => {
      props.history.push('/');
    })
    .catch(error => {
      console.log(error);
    });

  return null;
};

export default withRouter(Logout);
