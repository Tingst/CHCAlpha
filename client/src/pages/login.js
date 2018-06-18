import React from 'react';
import Particles from 'react-particles-js';
import { ViewCol } from '../components';
import {connect} from 'react-redux';
import { Button, Form } from 'semantic-ui-react';
import * as loginActions from '../actions/actioncreators';
import { bindActionCreators } from 'redux';
import Logo from 'babel-loader!svg-react-loader!../assets/chc-logo-white.svg';

const styles = {
  container: {
    position: 'relative',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  canvas: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#374255',
  },
  innerContainer: {
    alignItems: 'center',
    width: 350,
    height: 450,
    zIndex: 99
  },
  buttonsGroup: {
    marginBottom: '1rem'
  },
  buttonLogin: isActive => {
    return {
      color: '#FFFFFF',
      backgroundColor: isActive ? '#25dab9' : '#b0b0b0'
    }
  },
  buttonCreate: isActive => {
    return {
      color: '#FFFFFF',
      backgroundColor: isActive ? '#3981c1' : '#b0b0b0'
    }
  },
  buttonLoginAction: {
    marginTop: '1rem',
    color: '#FFFFFF',
    backgroundColor: '#25dab9'
  },
  buttonCreateAction: {
    marginTop: '1rem',
    color: '#FFFFFF',
    backgroundColor: '#3981c1'
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 36,
    marginBottom: '1rem'
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
    width: '100%',
  },
  buttonStyle: {
    marginTop: '1rem',
    width: 100
  }
};

const LoginPanel = ({ onPasswordBlur, onUsernameBlur }) => (
    <Form style={{ width: 288 }}>
      <Form.Field style={{ display: 'flex' }}>
      <input
        style={styles.inputStyle}
        placeholder="username"
        onBlur={onUsernameBlur}
      />
      </Form.Field>

      <Form.Field style={{ display: 'flex' }}>
        <input
          type="password"
          style={styles.inputStyle}
          placeholder="password"
          onBlur={onPasswordBlur}
        />
      </Form.Field>
    </Form>
);

const CreateAccountPanel = ({ onCreateInputBlur }) => (
    <Form style={{ width: 288 }}>
      <Form.Field style={{ display: 'flex' }}>
        <input
          style={styles.inputStyle}
          placeholder="first name"
          onBlur={e => onCreateInputBlur('newFname', e)}
        />
      </Form.Field>

      <Form.Field style={{ display: 'flex' }}>
        <input
          style={styles.inputStyle}
          placeholder="last name"
          onBlur={e => onCreateInputBlur('newLname', e)}
        />
      </Form.Field>

      <Form.Field style={{ display: 'flex' }}>
        <input
          style={styles.inputStyle}
          placeholder="username"
          onBlur={e => onCreateInputBlur('newUsername', e)}
        />
      </Form.Field>

      <Form.Field style={{ display: 'flex' }}>
        <input
          type="password"
          style={styles.inputStyle}
          placeholder="password"
          onBlur={e => onCreateInputBlur('newPassword', e)}
        />
      </Form.Field>
    </Form>
);

class ParticleBackground extends React.PureComponent {
  render() {
    return (
      <Particles
        style={styles.canvas}
        params={{
          particles: {
            line_linked: {
              shadow: {
                enable: true,
                color: "#3CA9D1",
                blur: 5
              }
            }
          }
        }}
      />
    )
  }
}

class LoginWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // login state
      username: '',
      password: '',
      isCreate: false,

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
    this.setState({ isCreate });
  }

  render() {
    return (
      <ViewCol style={styles.container}>

        <ParticleBackground />

        <ViewCol style={styles.innerContainer}>

          <Logo style={{ width: 250, color: '#FFF' }} />

          <Button.Group style={styles.buttonsGroup}>
            <Button
              className="login-btn"
              style={styles.buttonLogin(!this.state.isCreate)}
              onClick={() => this.handleSwitchPanel(false)}>
              Login
            </Button>
            <Button.Or />
            <Button
              className="login-btn"
              style={styles.buttonCreate(this.state.isCreate)}
              onClick={() => this.handleSwitchPanel(true)}>
              Create New Account
            </Button>
          </Button.Group>

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

          {!this.state.isCreate && <Button
            style={styles.buttonLoginAction}
            onClick={this.handleLogin}>
            Login
          </Button>}

          {this.state.isCreate && <Button
            style={styles.buttonCreateAction}
            onClick={this.handleCreateClick}>
            Create Account & Login
          </Button>}

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
