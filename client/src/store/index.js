import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Portfolio from './portfolio';
import Login from './login';
import Stocks from './stocks';

const rootReducer = combineReducers({
  Portfolio,
  Login,
  Stocks
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
