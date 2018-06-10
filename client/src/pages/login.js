import React from 'react';
import { Link } from 'react-router-dom';
import { ViewCol, ViewRow } from '../components';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ViewCol>
        <Link to="/dashboard">Go to dashboard</Link>
        <h1>HELLO LOGIN</h1>
      </ViewCol>
    )
  }
}