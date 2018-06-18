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
  table: {

  }
};

class HistoryPanelWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleCancelOrder = this.handleCancelOrder.bind(this);
  }

  componentDidMount() {
    // retrieve all current orders for this user
    this.props.handleGetOrders({ username: this.props.username});
  }

  handleFilterChange(e) {
    console.log(e.target.value);
  }

  handleCancelOrder(id) {
    this.props.handleCancelOrder({
      username: this.props.username,
      id
    });
  }

  render() {
    const FILTERS = [
      'None',
      'Buy',
      'Sell',
      '0-999',
      '1000-4900',
      '5000-9999',
      '>10k'
    ];

    return (
      <ViewCol style={styles.container}>
        <ViewRow style={{ justifyContent: 'space-between' }}>
          <h1>Pending Orders</h1>
          <ViewRow style={{ alignItems: 'center' }}>
            <label style={{marginRight: '1rem'}}>Filter By:</label>
            <select style={{ width: 100 }} onChange={this.handleFilterChange}>
              {FILTERS.map((key, id) => (
                <option key={id} value={key}>{key}</option>
              ))}
            </select>
          </ViewRow>
        </ViewRow>
        <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Ticker</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
              <Table.HeaderCell> </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.props.orders.map((order, id) => (
              <Table.Row key={id}>
                <Table.Cell>{order.type ? 'SELL' : 'BUY'}</Table.Cell>
                <Table.Cell>{order.ticker}</Table.Cell>
                <Table.Cell>{order.date}</Table.Cell>
                <Table.Cell>{order.number}</Table.Cell>
                <Table.Cell>{order.price}</Table.Cell>
                <Table.Cell>{order.number * order.price}</Table.Cell>
                <Table.Cell>
                    <i
                      className="times circle icon delete-button"
                      onClick={() => this.handleCancelOrder(order.id)}/>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </ViewCol>
    )
  }
}

const mapStateToProps = ({ Portfolio, Login }) => {
  return {
    orders: Portfolio.orders,
    username: Login.username
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...portfolioActions}, dispatch);
};

const HistoryPanel = connect(mapStateToProps, mapDispatchToProps)(HistoryPanelWrapper);

export default HistoryPanel;
