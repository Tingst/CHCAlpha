import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Portfolio from './portfolio';
import Login from './login';
import Stocks from './stocks';
import Errors from './errors';

const rootReducer = combineReducers({
  Portfolio,
  Login,
  Stocks,
  Errors
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
