import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Portfolio from './portfolio';
import Ipo from './ipo';
import Login from './login';

const rootReducer = combineReducers({
  Portfolio,
  Ipo,
  Login
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
