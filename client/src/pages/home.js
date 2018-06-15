import React from 'react';
import { Link } from 'react-router-dom';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ border: '2px solid green', height: '100%' }}>
        <Link to="/dashboard/ipo">to ipo</Link>
        <Link to="/login">to login</Link>
        <Link to="/dashboard/settings">to settings</Link>
        <h1>Hello world!</h1>
      </div>
    )
  }
}
