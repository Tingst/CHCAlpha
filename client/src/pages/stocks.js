import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as stocksActions from '../actions/actioncreators';

class StocksWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ border: '2px solid cyan', height: '100%' }}>
        <h1>Welcome to stocks view</h1>
      </div>
    )
  }
}

const mapStateToProps = ({ Stocks }) => {
  return {
    testState: Stocks.tree
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...stocksActions}, dispatch);
};

const Stocks = connect(mapStateToProps, mapDispatchToProps)(StocksWrapper);

export default Stocks;
