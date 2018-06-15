import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tab, Table } from 'semantic-ui-react';
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
  table: {

  }
};

class HistoryPanelWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <ViewCol style={styles.container}>
        <h1>Orders</h1>
        <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Ticker</Table.HeaderCell>
              <Table.HeaderCell>Exch.</Table.HeaderCell>
              <Table.HeaderCell># Shares</Table.HeaderCell>
              <Table.HeaderCell>Price/Share</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.props.orders.map((order, id) => (
              <Table.Row key={id}>
                <Table.Cell>{order.type ? 'SELL' : 'BUY'}</Table.Cell>
                <Table.Cell>{order.ticker}</Table.Cell>
                <Table.Cell>{order.exchange}</Table.Cell>
                <Table.Cell>{order.numShares}</Table.Cell>
                <Table.Cell>{order.price}</Table.Cell>
                <Table.Cell>{order.numShares * order.price}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </ViewCol>
    )
  }
}

const mapStateToProps = ({ Portfolio }) => {
  return {
    orders: [
      { type: 0, ticker: 'APPL', exchange: 'NYSE', numShares: 5, price: 100 },
      { type: 1, ticker: 'GOOGL', exchange: 'NASDAQ', numShares: 10, price: 1340 },
      { type: 1, ticker: 'AMZN', exchange: 'NASDAQ', numShares: 42, price: 1010 }
    ]
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...portfolioActions}, dispatch);
};

const HistoryPanel = connect(mapStateToProps, mapDispatchToProps)(HistoryPanelWrapper);

export default HistoryPanel;
