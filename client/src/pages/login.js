import React from 'react';
import { ViewCol, ViewRow } from '../components';
import {connect} from 'react-redux';
import * as loginActions from '../actions/actioncreators';
import { bindActionCreators } from 'redux';

const styles = {
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center'
  },
  loginPanel: {
    alignItems: 'center',
    width: 350
  },
  inputStyle: {
    width: 200,
  },
  buttonStyle: {
    marginTop: '1rem',
    width: 100
  }
};

const LoginPanel = ({ onPasswordBlur, onUsernameBlur, onLogin, onSwitchPanel }) => (
  <ViewCol style={styles.loginPanel}>
    <h1 style={styles.title}>CPSC 304 Project</h1>
    <input style={styles.inputStyle} placeholder="username" onBlur={onUsernameBlur} />
    <input style={styles.inputStyle} placeholder="password" onBlur={onPasswordBlur} />
    <ViewRow>
      <button style={styles.buttonStyle} onClick={onLogin}>Login</button>
      <button style={styles.buttonStyle} onClick={onSwitchPanel}>Create</button>
    </ViewRow>
  </ViewCol>
);

class LoginWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isCreate: false
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUsernameBlur = this.handleUsernameBlur.bind(this);
    this.handlePasswordBlur = this.handlePasswordBlur.bind(this);
  }

  handleLogin() {
    this.props.handleLogin({
      username: this.state.username,
      password: this.state.password
    });
  }

  handleUsernameBlur(e) {
    this.setState({ username: e.target.value });
  }

  handlePasswordBlur(e) {
    this.setState({ password: e.target.value });
  }

  handleCreate() {

  }

  handleSwitchPanel(isCreate) {
    this.setState({ isCreate: !isCreate });
  }

  render() {
    return (
      <ViewCol style={styles.container}>

        <LoginPanel
          onUsernameBlur={this.handleUsernameBlur}
          onPasswordBlur={this.handlePasswordBlur}
          onLogin={this.handleLogin}
          onSwitchPanel={this.handleSwitchPanel}
        />

      </ViewCol>
    )
  }
}


const mapStateToProps = ({ Login }) => {
  return {
    testState: Login.tree
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...loginActions}, dispatch);
};

const Login = connect(mapStateToProps, mapDispatchToProps)(LoginWrapper);
export default Login;
