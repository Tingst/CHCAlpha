import React from 'react';
import { Link } from 'react-router-dom';

export default class Ipo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ border: '2px solid cyan', height: '100%' }}>
        <Link to="/dashboard/home">to home</Link>
        <Link to="/login">to login</Link>
        <h1>Hello world! IPO</h1>
      </div>
    )
  }
}
