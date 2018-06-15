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
  loginPanel: {
    alignItems: 'center',
    width: '100%'
  },
  createPanel: {
    alignItems: 'center',
    width: 350
  },
  inputStyle: {
    width: 200,
  },
  buttonStyle: {
    marginTop: '1rem',
    width: 100
  },
  loginBtn: {
    width: 200,
    height: '2rem',
    textAlign: 'center',
    marginTop: '1rem'
  },
  createBtn: {
    width: 200,
    height: '2rem',
    textAlign: 'center',
    marginTop: '1rem'
  }
};

const LoginPanel = ({ onPasswordBlur, onUsernameBlur }) => (
  <ViewCol>
    <input style={styles.inputStyle} placeholder="username" onBlur={onUsernameBlur} />
    <input style={styles.inputStyle} placeholder="password" onBlur={onPasswordBlur} />
  </ViewCol>
);

const CreateAccountPanel = ({ onCreateInputBlur }) => (
  <ViewCol>
    <input
      style={styles.inputStyle}
      placeholder="first name"
      onBlur={e => onCreateInputBlur('newFname', e)}
    />
    <input
      style={styles.inputStyle}
      placeholder="last name"
      onBlur={e => onCreateInputBlur('newLname', e)}
    />
    <input
      style={styles.inputStyle}
      placeholder="username"
      onBlur={e => onCreateInputBlur('newUsername', e)}
    />
    <input
      style={styles.inputStyle}
      placeholder="password"
      onBlur={e => onCreateInputBlur('newPassword', e)}
    />
  </ViewCol>
);

class LoginWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // login state
      username: '',
      password: '',
      isCreate: true,

      // create account state
      newFname: '',
      newLname: '',
      newUsername: '',
      newPassword: ''
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUsernameBlur = this.handleUsernameBlur.bind(this);
    this.handlePasswordBlur = this.handlePasswordBlur.bind(this);
    this.handleCreateClick = this.handleCreateClick.bind(this);
    this.handleCreateInputBlur = this.handleCreateInputBlur.bind(this);
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

  handleCreateClick() {
    this.props.handleCreateNewAccount({
      fname: this.state.newFname,
      lname: this.state.newLname,
      username: this.state.newUsername,
      password: this.state.newPassword,
    });
  }

  handleCreateInputBlur(key, e) {
    this.setState({
      [key]: e.target.value
    });
  }

  handleSwitchPanel(isCreate) {
    this.setState({ isCreate: !isCreate });
  }

  render() {
    return (
      <ViewCol style={styles.container}>
        <ViewCol style={styles.innerContainer}>

          <h1 style={styles.title}>CPSC 304 Project</h1>

          <ViewRow style={styles.buttonsRow}>
            <button
              disabled={!this.state.isCreate}
              style={styles.buttonStyle}
              onClick={() => this.handleSwitchPanel(this.state.isCreate)}>
              Login
            </button>
            <button
              disabled={this.state.isCreate}
              style={styles.buttonStyle}
              onClick={() => this.handleSwitchPanel(this.state.isCreate)}>
              Create
            </button>
          </ViewRow>

          {!this.state.isCreate && <LoginPanel
            onUsernameBlur={this.handleUsernameBlur}
            onPasswordBlur={this.handlePasswordBlur}
            onLogin={this.handleLogin}
            onSwitchPanel={this.handleSwitchPanel}
          />}

          {this.state.isCreate && <CreateAccountPanel
            onCreateClick={this.handleCreateClick}
            onCreateInputBlur={this.handleCreateInputBlur}
            onSwitchPanel={this.handleSwitchPanel}
          />}

          {!this.state.isCreate && <button
            style={styles.loginBtn}
            onClick={this.handleLogin}>
            Login
          </button>}

          {this.state.isCreate && <button
            style={styles.createBtn}
            onClick={this.handleCreateClick}>
            Create Account & Login
          </button>}

        </ViewCol>
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
