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
    height: '3rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(34,36,38,.1)'
  }
};

const SummaryTable = ({ portfolios, onCreateNew, onNewPortfolioBlur }) => {
  let totalValue = 0;

  for (let portfolio of portfolios) {
    totalValue += portfolio.stocks.reduce((acc, curr) => acc += curr.currentPrice, 0)
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
          {portfolios.map((portfolio, id) => (
            <Table.Row key={id}>
              <Table.Cell>{portfolio.name}</Table.Cell>
              <Table.Cell textAlign='right'>
                {portfolio.stocks.reduce((acc, curr) => acc += curr.currentPrice, 0)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Footer */}
      <ViewRow style={styles.tableFooter}>
        <p style={{paddingLeft: '1rem'}}>{portfolios.length} Portfolios</p>
        <span>
          <input onBlur={onNewPortfolioBlur} placeholder="Create New Portfolio"/>
          <button onClick={onCreateNew}>Submit</button>
        </span>
        <p style={{paddingRight: '1rem'}}>Total Value: ${totalValue}</p>
      </ViewRow>
    </ViewCol>
  )
};

const PortfolioTable = ({ stocks, onDelete }) => (
  <ViewCol style={styles.tableContainer}>
    {/* Table */}
    <Table striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Symbol</Table.HeaderCell>
          <Table.HeaderCell>Exchange</Table.HeaderCell>
          <Table.HeaderCell>No. Shares</Table.HeaderCell>
          <Table.HeaderCell>Purchase Price</Table.HeaderCell>
          <Table.HeaderCell>Current Value</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {stocks.map((stock, id) => (
          <Table.Row key={id}>
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
      <button style={{ marginLeft: '1rem' }} onClick={onDelete}>Delete</button>
      <p style={{ paddingRight: '1rem' }}>Value: ${stocks.reduce((acc, curr) => acc += curr.currentPrice, 0)}</p>
    </ViewRow>
  </ViewCol>
);

class PortfolioPanelWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newPortfolioName: ''
    };
    this.handleCreateNewPortfolio = this.handleCreateNewPortfolio.bind(this);
    this.handleNewPortfolioBlur = this.handleNewPortfolioBlur.bind(this);
    this.handleDeletePortfolio = this.handleDeletePortfolio.bind(this);
  }

  handleCreateNewPortfolio() {
    if (this.state.newPortfolioName.length < 4) {
      // names must be at least 4 characters long
      return;
    }
    this.props.handleCreateNewPortfolio({ name: this.state.newPortfolioName })
  }

  handleNewPortfolioBlur(e) {
    this.setState({ newPortfolioName: e.target.value });
  }

  handleDeletePortfolio(id) {
    this.props.handleDeletePortfolio({id});
  }

  render() {
    const panes = this.props.portfolios.map((port, id) => ({
      menuItem: port.name,
      render: () => (
        <Tab.Pane id={id} style={styles.tabPane}>
          <PortfolioTable
            stocks={port.stocks}
            onDelete={() => this.handleDeletePortfolio(port.name)}
          />
        </Tab.Pane>
      )
    }));

    panes.unshift({
      menuItem: 'Summary',
      render: () => (
        <Tab.Pane id='summary' style={styles.tabPane}>
          <SummaryTable
            portfolios={this.props.portfolios}
            onNewPortfolioBlur={this.handleNewPortfolioBlur}
            onCreateNew={this.handleCreateNewPortfolio}
          />
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
    portfolios: Portfolio.portfolios
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...portfolioActions}, dispatch);
};

const PortfolioPanel = connect(mapStateToProps, mapDispatchToProps)(PortfolioPanelWrapper);

export default PortfolioPanel;