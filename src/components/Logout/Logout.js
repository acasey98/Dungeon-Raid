/* eslint-disable max-len */
import React from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';

import './Logout.scss';

// import PropTypes from 'prop-types';


class Logout extends React.Component {
  state = {
    authed: false,
  }

  logMeOut = (e) => {
    e.preventDefault();
    firebase.auth().signOut();
  }

  render() {
    // const { authed } = this.props;
    return (
          <div className="Logout">
            <button className="btn btn-secondary">Logout</button>
          </div>
    );
  }
}

export default Logout;
