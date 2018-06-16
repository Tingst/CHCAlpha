import history from '../utils/history';
import fetch from 'isomorphic-fetch';
import moment from 'moment';
import {
  // Login Page Actions
  HANDLE_LOGIN_SUCCESS,
  HANDLE_LOGIN_FAILURE,
  HANDLE_CREATE_ACCOUNT_SUCCESS,
  HANDLE_CREATE_ACCOUNT_FAILURE,
  // Portfolio Page Actions
  HANDLE_CREATE_PORTFOLIO_SUCCESS,
  HANDLE_DELETE_PORTFOLIO_SUCCESS,
  HANDLE_ORDER_SUCCESS,
  HANDLE_CANCEL_ORDER_SUCCESS,
  // Stock Page Actions
  HANDLE_TRENDS_REFRESH_SUCCESS,
  HANDLE_GET_DETAILS_SUCCESS,
  // wtf?
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

// -----------------------------------------------------------
// Portfolio Page Actions
// -----------------------------------------------------------
export const handleCreateNewPortfolio = (payload) => {
  const { name } = payload;

  // TODO: add http request here
  console.log('creating new portfolio with name: ', name);

  return dispatch => {
    dispatch({ type: HANDLE_CREATE_PORTFOLIO_SUCCESS, payload });
  }
};

export const handleDeletePortfolio = (payload) => {
  const { id } = payload;

  // TODO: add http request here
  console.log('deleting portfolio with id: ', id);

  return dispatch => {
    dispatch({ type: HANDLE_DELETE_PORTFOLIO_SUCCESS, payload });
  }
};

export const handlePlaceOrder = (payload) => {
  const { portfolio, type, ticker, number, price } = payload;

  // TODO: add http request here
  payload.id = number + price; // TODO: get ID number from request
  payload.date = moment().format('DD/MM/YY');
  console.log('placing order: ', portfolio, ticker);

  return dispatch => {
    dispatch({ type: HANDLE_ORDER_SUCCESS, payload });
  }
};

export const handleCancelOrder = (payload) => {
  const { id } = payload;

  // TODO: add http request here
  console.log('cancelling order with id: ', id);

  return dispatch => {
    dispatch({ type: HANDLE_CANCEL_ORDER_SUCCESS, payload });
  }
};

// -----------------------------------------------------------
// Stock Page Actions
// -----------------------------------------------------------
export const handleTrendsRefreshClick = () => {

  // TODO: add http request here
  console.log('refreshing stock trends...');

  const payload = {
    stockTrendHighest: { ticker: 'GOOGL',  exchange: 'NASDAQ',  price: 220, companyName: 'Alphabet' },
    stockTrendLowest: { ticker: 'BAYN',   exchange: 'ETR',     price: 35,  companyName: 'Bayer' },
    stockTrendMostFrequent: { ticker: 'PFE',    exchange: 'NYSE',    price: 483, companyName: 'Pfizer' },
    stockTrendLeastFrequent: { ticker: 'AMZN',   exchange: 'NASDAQ',  price: 449, companyName: 'Amazon' }

  };

  return dispatch => {
    dispatch({ type: HANDLE_TRENDS_REFRESH_SUCCESS, payload });
  }
};

export const handleTableRowClick = (payload) => {
  const { ticker } = payload;

  // TODO: add http request here to get company-specific details
  console.log('retrieving details for ticker: ', ticker);

  return dispatch => {
    dispatch({ type: HANDLE_GET_DETAILS_SUCCESS, payload });
  }
};




