import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Portfolio from './portfolio';
import Ipo from './ipo';
import Settings from './settings';
import Stocks from './stocks'
import {
  NavBar,
  SideBar,
  ViewCol,
  ViewRow
} from '../components';

export default class DashBoard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const match = this.props.match;

    return (
      <ViewCol style={{ height: '100%', width: '100%', flex: 'none', border: '2px solid grey' }}>
        <NavBar />

        <ViewRow style={{ height: '100%', border: '1px solid pink' }}>
          <SideBar />

          <ViewCol style={{ height: '100%', width: '100%', border: '3px solid purple' }}>
            <Switch>
              <Route
                exact
                path={`${match.url}/`}
                component={() => <Redirect to={`${match.url}/home`} />}
              />

              <Route
                path={`${match.url}/portfolio`}
                component={Portfolio}
              />

              <Route
                path={`${match.url}/stocks`}
                component={Stocks}
              />

              <Route
                path={`${match.url}/ipo`}
                component={Ipo}
              />

              <Route
                path={`${match.url}/settings`}
                component={Settings}
              />

            </Switch>
          </ViewCol>
        </ViewRow>
      </ViewCol>
    )
  }
}