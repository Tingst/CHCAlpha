import React from 'react';
import {ViewCol, ViewRow } from '../components';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerContainer: {
    alignItems: 'center',
    width: 350
  },
  buttonsRow: {
    justifyContent: 'center',
    width: '100%'
  },
  title: {
    textAlign: 'center'
  },
  inputStyle: {
    width: 200,
  },
  okBtn: {
    width: 200,
    height: '2rem',
    textAlign: 'center',
    marginTop: '1rem'
  }
};

export default class Settings extends React.Component {
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

  handleChangePassword(newPass) {
    this.setState({password: newPass})
  }

  handleConfirmPassword(user) {
    let alphaNumericRegex = RegExp('^[a-zA-Z0-9]*$');

    if (!alphaNumericRegex.test(user.oldpass) || !alphaNumericRegex.test(user.newpass) ||
        !alphaNumericRegex.test(user.duppass)) {
      window.alert("Passwords must not contain any special characters");
    }

    if (user.oldpass === user.newpass) {
      window.alert("Please choose a different password");
    } else if (user.newpass !== user.duppass) {
      window.alert("New passwords do not match");
    }
    this.handleChangePassword(user.newpass);
  }

  render() {
    return (
        <ViewCol style={styles.container}>
          <ViewCol style={styles.innerContainer}>

            <h1 style={styles.title}>Change your password</h1><br/>

            <input
              style={styles.inputStyle}
              placeholder="Enter old password"
              onBlur={e => this.handleInputBlur('oldpass', e)}
            />
            <input
              style={styles.inputStyle}
              placeholder="Enter new password"
              onBlur={e => this.handleInputBlur('newpass', e)}
            />
            <input
              style={styles.inputStyle}
              placeholder={"Confirm new password"}
              onBlur={e => this.handleInputBlur('duppass', e)}
            />

            <ViewRow style={styles.buttonsRow}>
              <button
                style={styles.okBtn}
                onClick={() => this.handleConfirmPassword(this.state)}>
                Ok
              </button>
            </ViewRow>

          </ViewCol>
        </ViewCol>
    )
  }
}
