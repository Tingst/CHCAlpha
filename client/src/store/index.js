import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Portfolio from './portfolio';
import Ipo from './ipo';
import Login from './login';
import Stocks from './stocks';

const rootReducer = combineReducers({
  Portfolio,
  Ipo,
  Login,
  Stocks
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
