import {
  HANDLE_LOGOUT,
  HANDLE_CREATE_ACCOUNT_SUCCESS,
  HANDLE_LOGIN_SUCCESS,

  // from Settings
  HANDLE_CHANGE_PASSWORD_SUCCESS
} from '../actions/constants';

const initialState = {
  username: '',
  password: '',
  fname: '',
  lname: ''
};

const Login = (state = initialState, action) => {
  switch(action.type) {

    case HANDLE_CREATE_ACCOUNT_SUCCESS:
    case HANDLE_LOGIN_SUCCESS: {
      return {
        ...state,
        fname: action.payload.fname,
        lname: action.payload.lname,
        username: action.payload.username,
        password: action.payload.password
      };
    }

    case HANDLE_CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        password: action.payload.newPassword
      };
    }

    case HANDLE_LOGOUT: {
      return initialState;
    }

    default: {
      return state;
    }

  }
};

export default Login;
