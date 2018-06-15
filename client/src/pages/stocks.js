import React from 'react';
import { ViewRow, ViewCol } from '../components';
import {
  StocksPanel,
  StockTrendsPanel,
  StockDetailsPanel
} from '../containers';

const styles = {
  container: {
    height: '100%',
    width: '100%'
  },
  leftPanel: {
    flex: '0.65'
  },
  rightPanel: {
    flex: '0.35'
  }
};

class Stocks extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ViewRow style={styles.container}>
        <ViewCol style={styles.leftPanel}>
          <StocksPanel />
        </ViewCol>
        <ViewCol style={styles.rightPanel}>
          <StockTrendsPanel />
          <StockDetailsPanel />
        </ViewCol>
      </ViewRow>
    )
  }
}

export default Stocks;
