import history from '../utils/history';
import fetch from 'isomorphic-fetch';
import {
  HANDLE_LOGIN_SUCCESS,
  HANDLE_LOGIN_FAILURE,
  HANDLE_CREATE_ACCOUNT_SUCCESS,
  HANDLE_CREATE_ACCOUNT_FAILURE,
  TEST_BEAR
} from './constants';

export const testAction = (payload) => {
  console.log('im clicked!');
  return dispatch => {
    dispatch({ type: TEST_BEAR, payload });
  }
};

// -----------------------------------------------------------
// Login Page Actions
// -----------------------------------------------------------
export const handleLogin = (payload) => {
  const { username, password } = payload;

  // TODO: add http request here
  console.log('logging in with username: ', username, ' and password: ', password);

  history.push('/dashboard');

  return dispatch => {
    dispatch({ type: HANDLE_LOGIN_SUCCESS, payload });
  }
};

export const handleCreateNewAccount = (payload) => {
  const { fname, lname, username, password } = payload;

  // TODO: add http request here
  console.log('im clicked! ', payload);

  history.push('/dashboard');

  return dispatch => {
    dispatch({ type: HANDLE_CREATE_ACCOUNT_SUCCESS, payload });
  }
};