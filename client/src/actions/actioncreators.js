import history from '../utils/history';
import fetch from 'isomorphic-fetch';
import {
  HANDLE_LOGIN_SUCCESS,
  HANDLE_LOGIN_FAILURE,
  TEST_BEAR
} from './constants';

export const testAction = (payload) => {
  console.log('im clicked!');
  return dispatch => {
    dispatch({ type: TEST_BEAR, payload });
  }
};

export const handleLogin = ({ username, password }) => {

  // TODO: add http request here
  console.log('logging in with username: ', username, ' and password: ', password);

  history.push('/dashboard');

  return dispatch => {
    dispatch({ type: HANDLE_LOGIN_SUCCESS });
  }
};
