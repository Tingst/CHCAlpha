import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as stockActions from '../actions/actioncreators';
import { ViewRow, ViewCol } from '../components';

const styles = {
  container: {
    display: 'flex',
    height: '100%',
    minHeight: 300,
    margin: '1rem',
    padding: '1rem',
    boxShadow: '0px 0px 5px #C1C1C1'
  },
  button: {
    width: 100
  },
  trendsRow: {
    marginTop: '1rem'
  },
  trendsLabel: {
    fontWeight: 600
  }
};

class StockTrendsPanelWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleTrendsRefreshClick = this.handleTrendsRefreshClick.bind(this);
  }

  handleTrendsRefreshClick() {
    this.props.handleTrendsRefreshClick();
  }

  render() {
    const {
      ticker: tickerHi,
      exchange: exchangeHi,
      price: priceHi,
      companyName: companyNameHi
    } = this.props.stockTrendHighest;

    const {
      ticker: tickerLo,
      exchange: exchangeLo,
      price: priceLo,
      companyName: companyNameLo
    } = this.props.stockTrendLowest;

    const {
      ticker: tickerFr,
      exchange: exchangeFr,
      price: priceFr,
      companyName: companyNameFr
    } = this.props.stockTrendMostFrequent;

    const {
      ticker: tickerLFr,
      exchange: exchangeLFr,
      price: priceLFr,
      companyName: companyNameLFr
    } = this.props.stockTrendLeastFrequent;

    return (
      <ViewCol style={styles.container}>
        <ViewRow style={{ justifyContent: 'space-between' }}>
        <h1>Trends</h1>
        <button style={styles.button} onClick={this.handleTrendsRefreshClick}>Refresh</button>
        </ViewRow>

        <span style={styles.trendsRow}><label style={styles.trendsLabel}>Highest Price/Share: </label><p>{companyNameHi} ({tickerHi}) Price: {priceHi} ({exchangeHi})</p></span>
        <span style={styles.trendsRow}><label style={styles.trendsLabel}>Lowest Price/Share: </label><p>{companyNameLo} ({tickerLo}) Price: {priceLo} ({exchangeLo})</p></span>
        <span style={styles.trendsRow}><label style={styles.trendsLabel}>Most Frequently Traded: </label><p>{companyNameFr} ({tickerFr}) Price: {priceFr} ({exchangeFr})</p></span>
        <span style={styles.trendsRow}><label style={styles.trendsLabel}>Least Frequently Traded: </label><p>{companyNameLFr} ({tickerLFr}) Price: {priceLFr} ({exchangeLFr})</p></span>
      </ViewCol>
    )
  }
}

const mapStateToProps = ({ Stocks }) => {
  return {
    stockTrendHighest: Stocks.stockTrendHighest,
    stockTrendLowest: Stocks.stockTrendLowest,
    stockTrendMostFrequent: Stocks.stockTrendMostFrequent,
    stockTrendLeastFrequent: Stocks.stockTrendLeastFrequent
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...stockActions}, dispatch);
};

const StockTrendsPanel = connect(mapStateToProps, mapDispatchToProps)(StockTrendsPanelWrapper);

export default StockTrendsPanel;
