import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button, Dropdown} from 'semantic-ui-react';
import * as ipoActions from '../actions/actioncreators';
import {ViewRow, ViewCol} from '../components';

const styles = {
  label: {
    paddingTop: '1rem',
    fontWeight: 700
  }
};

class IpoWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      industry: '',
      ticker: '',
      price: 0,
      numShares: 0,
      portfolio: '',
      exchange: ''
    };
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleIpoClick = this.handleIpoClick.bind(this);
  }

  componentDidMount() {
    this.props.handleGetAllStocks();
    this.props.handleGetPortfolios({ username: this.props.username });
  }

  handleInputBlur(e, key) {
    let alphaCheck = RegExp('^[a-zA-Z]*$');
    let alphaNumericCheck = RegExp('^[a-zA-Z0-9]*$');
    let numericCheck = RegExp('^[0-9]*$');

    if (key === 'name') {
      if (!alphaNumericCheck.test(e.target.value))
        window.alert("Please avoid special characters");
    } else if (key === 'industry' || key === 'ticker' || key === 'exchange') {
      if (!alphaCheck.test(e.target.value))
        window.alert("Please avoid numbers and special characters");
    } else if (key === 'price' || key === 'numShares') {
      if (!numericCheck.test(e.target.value))
        window.alert("Please enter a whole number (e.g. 300)");
    }

    this.setState({
      [key]: e.target.value
    });
  }

  handleIpoClick() {
    const {
      name,
      industry,
      ticker,
      price,
      numShares,
      portfolio,
      exchange
    } = this.state;
    console.log('clicky');
    this.props.handleIpoClick({
      username: this.props.username,
      name,
      industry,
      ticker: ticker.toUpperCase(),
      price: Number(price),
      numShares: Number(numShares),
      portfolio,
      exchange
    });

    // reset fields
    this.setState({
      name: '',
      industry: '',
      ticker: '',
      price: 0,
      numShares: 0,
      portfolio: '',
      exchange: ''
    });
    document.getElementById("ipo-change").reset();

  }

  render() {
    const portfolios = this.props.portfolios.length > 0 ? this.props.portfolios.map((port, id) => ({
      key: id, text: port.name, value: port.name
    })) : [];

    return (
      <ViewRow style={{height: '100%'}}>
        <ViewCol style={{padding: '1rem'}}>
        <h1>Initial Public Offering</h1>
          <form id="ipo-change" style={{ display: 'flex', flexFlow: 'column' }}>
            <label style={styles.label}>Company Name</label>
              <input
                placeholder="e.g. Apple"
                onBlur={e => this.handleInputBlur(e, 'name')}/>

            <label style={styles.label}>Industry</label>
              <input
                placeholder="e.g. Energy"
                onBlur={e => this.handleInputBlur(e, 'industry')} />

            <label style={styles.label}>Ticker Symbol</label>
              <input
                placeholder="e.g. APPL"
                onBlur={e => this.handleInputBlur(e, 'ticker')} />

            <label style={styles.label}>Price</label>
              <input
                placeholder="e.g. 30"
                onBlur={e => this.handleInputBlur(e, 'price')} />

            <label style={styles.label}>#Shares</label>
              <input
                placeholder="e.g. 10000"
                onBlur={e => this.handleInputBlur(e, 'numShares')} />

            <label style={styles.label}>Portfolio</label>
              <Dropdown
                button className='icon'
                floating labeled icon='open folder'
                options={portfolios}
                search text={this.state.portfolio ? this.state.portfolio : '---'}
                onChange={(e, val) => this.handleInputBlur({target: val}, 'portfolio')} />

            <label style={styles.label}>Exchange</label>
              <Dropdown
                button className='icon'
                floating labeled icon='world'
                options={this.props.exchanges}
                search text={this.state.exchange ? this.state.exchange : '---'}
                onChange={(e, val) => this.handleInputBlur({target: val}, 'exchange')}
              />
          </form>

          <Button style={{marginTop: '1rem'}} onClick={this.handleIpoClick}>Submit</Button>

        </ViewCol>
      </ViewRow>)
  }
}

const mapStateToProps = ({Stocks, Portfolio, Login}) => {
  return {
    exchanges: Stocks.exchanges,
    portfolios: Portfolio.portfolios,
    username: Login.username
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...ipoActions}, dispatch);
};

const Ipo = connect(mapStateToProps, mapDispatchToProps)(IpoWrapper);

export default Ipo;