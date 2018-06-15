import React from 'react';
import { Link } from 'react-router-dom';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Password goes here.'
    };

    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div style={{ border: '2px solid black', height: '100%' }}>
        <Link to="/login">to login</Link>
        <h1>Change your password</h1>
        <h5>Enter your old password</h5>
        <h5>Enter new password</h5>
        <form>
          Enter old password: <input type="text" name="oldpass"/><br/>
          Enter new password: <input type="text" name="newpass"/><br/>
          <input type="submit" value="Submit"/>
        </form>
      </div>
    )
  }
}
