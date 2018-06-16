import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown, Table } from 'semantic-ui-react';
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
  header: {
    width: '100%',
    minHeight: '2rem',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  table: {

  }
};

const ExchangeSearch = ({ selectedExchange, exchanges, onExchangeSearch }) => (
  <Dropdown
    button
    className='icon'
    floating
    labeled
    icon='world'
    options={exchanges}
    search
    text={selectedExchange ? selectedExchange : 'Exchange'}
    onChange={onExchangeSearch}
  />
);


class StocksPanelWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      selectedExchange: '',

    };

    this.handleSearchKeyDown = this.handleSearchKeyDown.bind(this);
    this.handleExchangeSearch = this.handleExchangeSearch.bind(this);
    this.handleTableRowClick = this.handleTableRowClick.bind(this);
  }

  handleSearchKeyDown(e) {
    if (e.keyCode === 13) {
      this.setState({ search: e.target.value });
    }
  }

  handleExchangeSearch(e, val) {
    this.setState({ selectedExchange: val.value });
  }

  handleTableRowClick(ticker) {
    this.props.handleTableRowClick({ ticker });
  }

  render() {
    let stocks = this.props.stocks;

    if (this.state.search) {
      // filter stocks that match the search string
      stocks = this.props.stocks.filter((stock) => {
        return stock.ticker.includes(this.state.search.toUpperCase())
          || stock.companyName.toLowerCase().includes(this.state.search.toLowerCase());
      });
    }
    if (this.state.selectedExchange !== '' && this.state.selectedExchange !== 'ALL') {
      // filter stocks that match the selected exchange
      stocks = stocks.filter(stock => {
        return stock.exchange === this.state.selectedExchange;
      });
    }

    return (
      <ViewCol style={styles.container}>

        {/* Header */}
        <ViewRow style={styles.header}>
            <ViewRow style={{ width: '100%', alignItems: 'center' }}>
              <h1 style={{ marginRight: '1rem' }}>Market Overview</h1>
              <ExchangeSearch
                selectedExchange={this.state.selectedExchange}
                exchanges={this.props.exchanges}
                onExchangeSearch={this.handleExchangeSearch}
              />
            </ViewRow>
            <input placeholder="search ticker/company" onKeyDown={this.handleSearchKeyDown} />
        </ViewRow>

        {/* Body */}
        <Table striped selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Symbol</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Exchange</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {stocks.map((stock, id) => (
              <Table.Row
                key={id}
                onClick={() => this.handleTableRowClick(stock.ticker)}
              >
                <Table.Cell>{stock.ticker}</Table.Cell>
                <Table.Cell>{stock.companyName}</Table.Cell>
                <Table.Cell>{stock.exchange}</Table.Cell>
                <Table.Cell>{stock.price}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </ViewCol>
    )
  }
}

const mapStateToProps = ({ Stocks }) => {
  return {
    stocks: Stocks.stocks,
    exchanges: Stocks.exchanges
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...stockActions}, dispatch);
};

const StocksPanel = connect(mapStateToProps, mapDispatchToProps)(StocksPanelWrapper);

export default StocksPanel;
