import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Button, Tab, Table } from 'semantic-ui-react';
import { ViewRow, ViewCol } from '../components';
import * as portfolioActions from '../actions/actioncreators';

const styles = {
  container: {
    height: '100%',
    width: '100%'
  },
  tab: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%',
    width: '100%'
  },
  tabPane: {
    padding: 0,
    height: '100%',
    overflow: 'auto'
  },
  tableContainer: {
    justifyContent: 'space-between',
    height: '100%'
  },
  tableFooter: {
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(34,36,38,.1)'
  }
};

const SummaryTable = ({ portfolios }) => {
  let totalValue = 0;

  for (let portfolio of portfolios) {
    totalValue += portfolio.stocks.reduce((acc, curr) => acc += curr.purchasePrice, 0)
  }

  return (
    <ViewCol style={styles.tableContainer}>
      {/* Table */}
      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>Portfolio Value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {portfolios.map(portfolio => (
            <Table.Row>
              <Table.Cell>{portfolio.name}</Table.Cell>
              <Table.Cell textAlign='right'>
                {portfolio.stocks.reduce((acc, curr) => acc += curr.purchasePrice, 0)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Footer */}
      <ViewRow style={styles.tableFooter}>
        <Button>Delete</Button>
        <p style={{paddingRight: '1rem'}}>Value: ${totalValue}</p>
      </ViewRow>
    </ViewCol>
  )
};

const PortfolioTable = ({ stocks }) => (
  <ViewCol style={styles.tableContainer}>
    {/* Table */}
    <Table striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Ticker</Table.HeaderCell>
          <Table.HeaderCell>Exchange</Table.HeaderCell>
          <Table.HeaderCell>No. Shares</Table.HeaderCell>
          <Table.HeaderCell>Purchase Price</Table.HeaderCell>
          <Table.HeaderCell>Current Value</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {stocks.map(stock => (
          <Table.Row>
            <Table.Cell>{stock.ticker}</Table.Cell>
            <Table.Cell>{stock.exchange}</Table.Cell>
            <Table.Cell>{stock.numShares}</Table.Cell>
            <Table.Cell>{stock.purchasePrice}</Table.Cell>
            <Table.Cell>{stock.currentPrice}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>

    {/* Footer */}
    <ViewRow style={styles.tableFooter}>
      <Button>Delete</Button>
      <p style={{ paddingRight: '1rem' }}>Value: ${stocks.reduce((acc, curr) => acc += curr.purchasePrice, 0)}</p>
    </ViewRow>
  </ViewCol>
);

class PortfolioPanelWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const panes = this.props.portfolios.map((port, id) => ({
      menuItem: port.name,
      render: () => (
        <Tab.Pane id={id} style={styles.tabPane}>
          <PortfolioTable
            stocks={port.stocks}
          />
        </Tab.Pane>
      )
    }));

    panes.unshift({
      menuItem: 'Summary',
      render: () => (
        <Tab.Pane id='summary' style={styles.tabPane}>
          <SummaryTable portfolios={this.props.portfolios} />
        </Tab.Pane>
      )
    });

    return (
      <ViewRow style={styles.container}>
        <Tab panes={panes} style={styles.tab}/>
      </ViewRow>
    )
  }
}

const mapStateToProps = ({ Portfolio }) => {
  return {
    portfolios: [
      {
        name: 'port1',
        stocks: [
          { ticker: 'APPL', exchange: 'NASDAQ', numShares: 10, purchasePrice: 1000, currentPrice: 1800 },
          { ticker: 'GOOGL', exchange: 'NASDAQ', numShares: 15, purchasePrice: 20000, currentPrice: 24342 },
          { ticker: 'TSLA', exchange: 'NASDAQ', numShares: 100, purchasePrice: 4000, currentPrice: 5646 },
          { ticker: 'PFE', exchange: 'NYSE', numShares: 131, purchasePrice: 4893, currentPrice: 3870 },
          { ticker: 'GLAXO', exchange: 'NSE', numShares: 40, purchasePrice: 2330, currentPrice: 1970 },
          { ticker: 'BAYN', exchange: 'ETR', numShares: 5, purchasePrice: 365, currentPrice: 605 }
        ]
      },
      {
        name: 'port2',
        stocks: [
          { ticker: 'BABA', exchange: 'NYSE', numShares: 40, purchasePrice: 6556, currentPrice: 8394 },
          { ticker: 'BA', exchange: 'NYSE', numShares: 43, purchasePrice: 24141, currentPrice: 43332 },
          { ticker: 'AMZN', exchange: 'NASDAQ', numShares: 13, purchasePrice: 44949, currentPrice: 90029 }
        ]
      }
    ]
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...portfolioActions}, dispatch);
};

const PortfolioPanel = connect(mapStateToProps, mapDispatchToProps)(PortfolioPanelWrapper);

export default PortfolioPanel;