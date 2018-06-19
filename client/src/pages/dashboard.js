import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Portfolio from './portfolio';
import Ipo from './ipo';
import Settings from './settings';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as dashboardActions from '../actions/actioncreators';

import Stocks from './stocks'
import {
  NavBar,
  SideBar,
  ViewCol,
  ViewRow
} from '../components';

class DashboardWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const match = this.props.match;

    return (
      <ViewCol style={{ height: '100%', width: '100%', flex: 'none' }}>
        <NavBar onLogout={this.props.handleLogout} />

        <ViewRow style={{ height: '100%' }}>
          <SideBar match={this.props.match} />

          <ViewCol style={{ height: '100%', width: '100%' }}>
            <Switch>
              <Route
                exact
                path={`${match.url}/`}
                component={() => <Redirect to={`${match.url}/portfolio`} />}
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

const mapStateToProps = ({ }) => {
  return { }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...dashboardActions}, dispatch);
};

const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardWrapper);

export default Dashboard;