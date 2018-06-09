import {
  TEST_BEAR
} from '../actions/constants';

const initialState = {
  tree: 'bear'
};

const Login = (state = initialState, action) => {
  switch(action.type) {

    case TEST_BEAR: {
      return { ...state, tree: action.payload };
    }
    default: {
      return state;
    }

  }
};

export default Login;
