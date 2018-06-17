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
  HANDLE_CREATE_PORTFOLIO_FAILURE,
  HANDLE_DELETE_PORTFOLIO_SUCCESS,
  HANDLE_DELETE_PORTFOLIO_FAILURE,
  HANDLE_PLACE_ORDER_SUCCESS,
  HANDLE_PLACE_ORDER_FAILURE,
  HANDLE_CANCEL_ORDER_SUCCESS,
  HANDLE_CANCEL_ORDER_FAILURE,
  // Stock Page Actions
  HANDLE_TRENDS_REFRESH_SUCCESS,
  HANDLE_TRENDS_REFRESH_FAILURE,
  HANDLE_GET_DETAILS_SUCCESS,
  HANDLE_GET_DETAILS_FAILURE,
  // IPO Page Actions
  HANDLE_NEW_IPO_SUCCESS,
  HANDLE_NEW_IPO_FAILURE,
  // SettingsPage Actions
  HANDLE_CHANGE_PASSWORD_SUCCESS,
  HANDLE_CHANGE_PASSWORD_FAILURE
} from './constants';

const HOST = "http://localhost:9000/";
const optionsBase = {
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json'
  },
  mode: 'cors'
};

// -----------------------------------------------------------
// Login Page Actions
// -----------------------------------------------------------
export const handleLogin = (payload) => {
  const { username, password } = payload;

  const options = {
    ...optionsBase,
    method: 'POST',
    body: JSON.stringify({
      username,
      password
    })
  };

  return dispatch => {
    fetch(`${HOST}login`, options)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.code === 200) {
          payload = res;
          dispatch({ type: HANDLE_LOGIN_SUCCESS, payload });
          history.push('/dashboard');
        } else {
          dispatch({ type: HANDLE_LOGIN_FAILURE });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: HANDLE_LOGIN_FAILURE });
      });

    }
};

export const handleCreateNewAccount = (payload) => {
  const { fname, lname, username, password } = payload;

  const options = {
    ...optionsBase,
    method: 'POST',
    body: JSON.stringify({
      fname,
      lname,
      username,
      password
    })
  };

  return dispatch => {
    fetch(`${HOST}create`, options)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.code === 200) {
          payload = { ...payload, ...res };
          dispatch({ type: HANDLE_CREATE_ACCOUNT_SUCCESS, payload });
          history.push('/dashboard');
        } else {
          dispatch({ type: HANDLE_CREATE_ACCOUNT_FAILURE });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: HANDLE_CREATE_ACCOUNT_FAILURE });
      });
    }
};

// -----------------------------------------------------------
// Portfolio Page Actions
// -----------------------------------------------------------
export const handleCreateNewPortfolio = (payload) => {
  const { name, username } = payload;

  const options = {
    ...optionsBase,
    method: 'POST',
    body: JSON.stringify({
      username,
      name
    })
  };

  return dispatch => {
    fetch(`${HOST}createportfolio`, options)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.code === 200) {
          payload = { ...payload, ...res };
          dispatch({ type: HANDLE_CREATE_PORTFOLIO_SUCCESS, payload });
        } else {
          dispatch({ type: HANDLE_CREATE_PORTFOLIO_FAILURE });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: HANDLE_CREATE_PORTFOLIO_FAILURE });
      });
    }
};

export const handleDeletePortfolio = (payload) => {
  const { id, username } = payload;

  const options = {
    ...optionsBase,
    method: 'DELETE',
    body: JSON.stringify({
      username,
      name: id
    })
  };

  return dispatch => {
    fetch(`${HOST}deleteportfolio`, options)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.code === 200) {
          payload = { ...payload, ...res };
          dispatch({ type: HANDLE_DELETE_PORTFOLIO_SUCCESS, payload });
        } else {
          dispatch({ type: HANDLE_DELETE_PORTFOLIO_FAILURE });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: HANDLE_DELETE_PORTFOLIO_FAILURE });
      });
  }
};

export const handlePlaceOrder = (payload) => {
  const { username, portfolio, type, ticker, number, price } = payload;

  payload.id = number + price; // TODO: get order ID number from request
  payload.date = moment().format('DD/MM/YY');

  const options = {
    ...optionsBase,
    method: 'POST',
    body: JSON.stringify({
      username,
      portfolio,
      type,
      ticker,
      number,
      price,
      date: payload.date
    })
  };

  return dispatch => {
    fetch(`${HOST}placeorder`, options)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.code === 200) {
          payload = { ...payload, ...res };
          dispatch({ type: HANDLE_PLACE_ORDER_SUCCESS, payload });
        } else {
          dispatch({ type: HANDLE_PLACE_ORDER_FAILURE });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: HANDLE_PLACE_ORDER_FAILURE });
      });
    }
};

export const handleCancelOrder = (payload) => {
  const { username, id } = payload;

  const options = {
    ...optionsBase,
    method: 'DELETE',
    body: JSON.stringify({
      username,
      id,
    })
  };

  return dispatch => {
    fetch(`${HOST}cancelorder`, options)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.code === 200) {
          payload = { ...payload, ...res };
          dispatch({ type: HANDLE_CANCEL_ORDER_SUCCESS, payload });
        } else {
          dispatch({ type: HANDLE_CANCEL_ORDER_FAILURE });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: HANDLE_CANCEL_ORDER_FAILURE });
      });
  }
};

// -----------------------------------------------------------
// Stock Page Actions
// -----------------------------------------------------------
export const handleTrendsRefreshClick = () => {

  let payload = {
    stockTrendHighest: { ticker: 'GOOGL',  exchange: 'NASDAQ',  price: 220, companyName: 'Alphabet' },
    stockTrendLowest: { ticker: 'BAYN',   exchange: 'ETR',     price: 35,  companyName: 'Bayer' },
    stockTrendMostFrequent: { ticker: 'PFE',    exchange: 'NYSE',    price: 483, companyName: 'Pfizer' },
    stockTrendLeastFrequent: { ticker: 'AMZN',   exchange: 'NASDAQ',  price: 449, companyName: 'Amazon' }
  };

  const options = {
    ...optionsBase,
    method: 'GET'
  };

  return dispatch => {
    fetch(`${HOST}trends`, options)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.code === 200) {
          payload = { ...payload, ...res };
          dispatch({ type: HANDLE_TRENDS_REFRESH_SUCCESS, payload });
        } else {
          dispatch({ type: HANDLE_TRENDS_REFRESH_FAILURE });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: HANDLE_TRENDS_REFRESH_FAILURE });
      });
  }
};

export const handleTableRowClick = (payload) => {
  const { ticker } = payload;

  const options = {
    ...optionsBase,
    method: 'POST',
    body: JSON.stringify({
      ticker
    })
  };

  return dispatch => {
    fetch(`${HOST}company`, options)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.code === 200) {
          payload = { ...payload, ...res };
          dispatch({ type: HANDLE_GET_DETAILS_SUCCESS, payload });
        } else {
          dispatch({ type: HANDLE_GET_DETAILS_FAILURE });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: HANDLE_GET_DETAILS_FAILURE });
      });
    }
};

// -----------------------------------------------------------
// IPO Page Actions
// -----------------------------------------------------------
export const handleIpoClick = (payload) => {
  const {
    name,
    industry,
    ticker,
    price,
    numShares,
    portfolio,
    exchange,
  } = payload;

  console.log(`issuing ${numShares} new shares at $${price}/share for company: `, name, ticker);

  const options = {
    ...optionsBase,
    method: 'POST',
    body: JSON.stringify({
      name,
      industry,
      ticker,
      price,
      numShares,
      portfolio,
      exchange
    })
  };

  return dispatch => {
    fetch(`${HOST}ipo`, options)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.code === 200) {
          payload = { ...payload, ...res };

          // TODO: remove following line, get current price from server
          payload.currentPrice = price + 20;
          dispatch({ type: HANDLE_NEW_IPO_SUCCESS, payload });
        } else {
          dispatch({ type: HANDLE_NEW_IPO_FAILURE });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: HANDLE_NEW_IPO_FAILURE });
      });
  }
};

// -----------------------------------------------------------
// Settings Page Actions
// -----------------------------------------------------------
export const handleChangePasswordClick = (payload) => {
  const { username, oldPassword, newPassword } = payload;

  const options = {
    ...optionsBase,
    method: 'UPDATE',
    body: JSON.stringify({
      username,
      oldPassword,
      newPassword
    })
  };

  return dispatch => {
    fetch(`${HOST}password`, options)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.code === 200) {
          payload = { ...payload, ...res };

          dispatch({ type: HANDLE_CHANGE_PASSWORD_SUCCESS, payload });
        } else {
          dispatch({ type: HANDLE_CHANGE_PASSWORD_FAILURE });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: HANDLE_CHANGE_PASSWORD_FAILURE });
      });
  }
};
