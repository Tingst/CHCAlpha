import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table } from 'semantic-ui-react';
import * as portfolioActions from '../actions/actioncreators';
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
  tableContainer: {
  }
};

class HistoryPanelWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleCancelOrder = this.handleCancelOrder.bind(this);
  }

  componentDidMount() {
    // retrieve all pending orders for this company
    this.props.handleGetOrders({ username: "*" });
  }

  handleFilterChange(e) {
    console.log(e.target.value);
  }

  handleCancelOrder(id) {
    this.props.handleCancelOrder({ id });
  }

  render() {
    const {
      ticker,
      exchange,
      companyName,
      price,
      industry
    } = this.props.selected;

    return (
      <ViewCol style={styles.container}>
        <ViewRow style={{ justifyContent: 'space-between' }}>
          <h1>{companyName}</h1>
          <h1>${price}</h1>
        </ViewRow>

        <ViewRow style={{ justifyContent: 'space-between' }}>
          <p className="details-subtitle">{exchange}: {ticker}</p>
          <p className="details-subtitle">{industry.charAt(0).toUpperCase() + industry.substr(1)}</p>
        </ViewRow>
        <p style={{ fontWeight: 700, borderTop: '1px solid rgba(34,36,38,.1)' }}>Pending Orders: ${ticker}</p>

        <ViewCol style={styles.tableContainer}>
          <Table striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Ticker</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.props.allOrders
                .filter(order => order.ticker === ticker)
                .map((order, id) => (
                  <Table.Row key={id}>
                    <Table.Cell>{order.type ? 'SELL' : 'BUY'}</Table.Cell>
                    <Table.Cell>{order.ticker}</Table.Cell>
                    <Table.Cell>{order.date}</Table.Cell>
                    <Table.Cell>{order.number}</Table.Cell>
                    <Table.Cell>{order.price}</Table.Cell>
                    <Table.Cell>{order.number * order.price}</Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </ViewCol>

      </ViewCol>
    )
  }
}

const mapStateToProps = ({ Stocks, Portfolio }) => {
  return {
    selected: Stocks.selected,
    allOrders: Portfolio.allOrders
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...portfolioActions}, dispatch);
};

const HistoryPanel = connect(mapStateToProps, mapDispatchToProps)(HistoryPanelWrapper);

export default HistoryPanel;
