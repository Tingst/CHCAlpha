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
  title: {
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
    if (user.oldpass === user.newpass) {
      window.alert("Please choose a different password!");
    } else if (user.newpass !== user.duppass) {
      window.alert("New passwords do not match!");
    }

    this.props.handleChangePasswordClick({
      username: this.props.username,
      oldPassword: user.oldpass,
      newPassword: user.newpass
    });
  }

  render() {
    return (
      <ViewCol style={styles.container}>
        <ViewCol style={styles.innerContainer}>

          <h1 style={styles.title}>Change your password</h1>

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
    username: Login.username
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...settingsActions}, dispatch);
};

const Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsWrapper);

export default Settings;
