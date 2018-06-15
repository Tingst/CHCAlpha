import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tab, Table } from 'semantic-ui-react';
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
  table: {

  }
};

class StocksPanelWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };

    this.handleSearchKeyDown = this.handleSearchKeyDown.bind(this);
  }

  handleSearchKeyDown(e) {
    if (e.keyCode === 13) {
      this.setState({ search: e.target.value });
    }
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

    return (
      <ViewCol style={styles.container}>

        <ViewRow style={{ width: '100%', justifyContent: 'flex-end' }}>
          <ViewRow>
            <input placeholder="search ticker/company" onKeyDown={this.handleSearchKeyDown} />
          </ViewRow>
        </ViewRow>


        <Table striped>
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
              <Table.Row key={id}>
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
    stocks: Stocks.stocks
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...stockActions}, dispatch);
};

const StocksPanel = connect(mapStateToProps, mapDispatchToProps)(StocksPanelWrapper);

export default StocksPanel;
