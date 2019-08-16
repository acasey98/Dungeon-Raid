import React from 'react';
import {
  BrowserRouter, Route, Redirect, Switch,
} from 'react-router-dom';

import firebase from 'firebase/app';
import 'firebase/auth';

import Base from '../components/Base/Base';
import Logout from '../components/Logout/Logout';
import Auth from '../components/Auth/Auth';
import ChooseItem from '../components/Base/ChooseItem/ChooseItem';
import Adventure from '../components/Adventure/Adventure';
import youLose from '../components/youLose/youLose';
import youWin from '../components/youWin/youWin';

import fbConnection from '../helpers/data/connection';

fbConnection();

const PublicRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = props => (
    authed === false
      ? (<Component {...props} />)
      : (<Redirect to={{ pathname: '/base', state: { from: props.location } }} />)
  );
  return <Route {...rest} render={props => routeChecker(props)} />;
};

const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = props => (
    authed === true
      ? (<Component {...props} />)
      : (<Redirect to={{ pathname: '/auth', state: { from: props.location } }} />)
  );
  return <Route {...rest} render={props => routeChecker(props)} />;
};

class App extends React.Component {
  state = {
    authed: false,
  }

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ authed: true });
      } else {
        this.setState({ authed: false });
      }
    });
  }

  render() {
    const { authed } = this.state;
    return (
    <div className="App">
      <BrowserRouter>
          <React.Fragment>
            <Logout authed={authed}/>
            <div className='container'>
              <div className='row'>
                <Switch>
                  <PublicRoute path='/auth' component={Auth} authed={authed}/>

                  <PrivateRoute path='/base' component={Base} authed={authed}/>
                  <PrivateRoute path='/choose_item' component={ChooseItem} authed={authed}/>

                  <PrivateRoute path='/adventure' component={Adventure} authed={authed}/>

                  <PrivateRoute path='/you_lose' component={youLose} authed={authed}/>
                  <PrivateRoute path='/you_win' component={youWin} authed={authed}/>

                  <Redirect from='*' to='/auth' />
                </Switch>
              </div>
            </div>
          </React.Fragment>
        </BrowserRouter>
    </div>
    );
  }
}

export default App;
