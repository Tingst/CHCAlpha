import React from 'react';
import {ViewCol, ViewRow } from '../components';
import { Button, Form } from 'semantic-ui-react';
import * as settingsActions from '../actions/actioncreators';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const styles = {
  container: {
    height: '100%'
  },
  innerContainer: {
    padding: '1rem',
    width: '40%'
  },
  buttonsRow: {
    width: '100%'
  },
  detailsRow: {
    marginTop: '1rem'
  },
  label: {
    fontWeight: 700
  },
  inputStyle: {
    marginTop: '1rem',
    width: 200,
  },
  okBtn: {
    width: 200,
    marginTop: '1rem'
  }
};

class SettingsWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // password state
      password: '',
      oldpass: '',
      newpass: '',
      duppass: ''
    };

    this.handleInputBlur = this.handleInputBlur.bind(this);
  }

  handleInputBlur(key, e) {
    this.setState({
      [key]: e.target.value
    });
  }

  handleConfirmPassword(user) {
    let alphaNumericCheck = RegExp('^[a-zA-Z0-9]*$');

    if (!alphaNumericCheck.test(user.oldpass) || !alphaNumericCheck.test(user.newpass) ||
        !alphaNumericCheck.test(user.duppass)) {
      window.alert("Passwords must not contain any special characters");
    }

    if (user.oldpass === user.newpass) {
      window.alert("Please choose a different password");
    } else if (user.newpass !== user.duppass) {
      window.alert("New passwords do not match");
    }

    // submit change request
    this.props.handleChangePasswordClick({
      username: this.props.username,
      oldPassword: user.oldpass,
      newPassword: user.newpass
    });

    // reset fields
    this.setState({
      password: '',
      oldpass: '',
      newpass: '',
      duppass: ''
    })
  }

  render() {
    return (
      <ViewCol style={styles.container}>
        <ViewCol style={styles.innerContainer}>

          <h1 style={styles.title}>Account</h1>
          <span style={styles.detailsRow}><label style={styles.label}>Username: </label>{this.props.username}</span>
          <span style={styles.detailsRow}><label style={styles.label}>First Name: </label>{this.props.fname}</span>
          <span style={{ ...styles.detailsRow, marginBottom: '1rem' }}><label style={styles.label}>Last Name: </label>{this.props.lname}</span>

          <h1 style={{ ...styles.title, marginTop: '2rem' }}>Change your Password</h1>
          <input
            type="password"
            style={styles.inputStyle}
            placeholder="Enter old password"
            onBlur={e => this.handleInputBlur('oldpass', e)}
          />
          <input
            type="password"
            style={styles.inputStyle}
            placeholder="Enter new password"
            onBlur={e => this.handleInputBlur('newpass', e)}
          />
          <input
            type="password"
            style={styles.inputStyle}
            placeholder={"Confirm new password"}
            onBlur={e => this.handleInputBlur('duppass', e)}
          />

          <ViewRow style={styles.buttonsRow}>
            <Button
              style={styles.okBtn}
              onClick={() => this.handleConfirmPassword(this.state)}>
              Submit
            </Button>
          </ViewRow>

        </ViewCol>
      </ViewCol>
    )
  }
}

const mapStateToProps = ({ Login }) => {
  return {
    username: Login.username,
    fname: Login.fname,
    lname: Login.lname
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...settingsActions}, dispatch);
};

const Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsWrapper);

export default Settings;
