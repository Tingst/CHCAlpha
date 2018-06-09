import React from 'react';
import { Provider } from 'react-redux';
import {
  HashRouter,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import store from '../store';
import { ViewCol } from '../components';
import Login from './login';
import DashBoard from './dashboard';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <ViewCol style={{border: '1px solid yellow', height: '100%', width: '100%' }}>
          <HashRouter>
            <Switch>
              <Route
                exact
                path="/"
                component={() => <Redirect to="/login" />}
              />
              <Route
                path="/login"
                component={Login}
              />
              <Route
                style={{ border: '1px solid red' }}
                path="/dashboard"
                component={DashBoard}
              />
            </Switch>
          </HashRouter>
        </ViewCol>
      </Provider>
    )
  }
}
