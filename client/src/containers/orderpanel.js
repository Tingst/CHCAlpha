import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown, Form } from 'semantic-ui-react';
import * as portfolioActions from '../actions/actioncreators';
import { ViewRow, ViewCol } from '../components';

const styles = {
  container: {
    display: 'flex',
    flex: 'none',
    height: 'min-content',
    margin: '1rem',
    padding: '1rem',
    boxShadow: '0px 0px 5px #C1C1C1'
  }
};

const numericCheck = RegExp('^[0-9]*$');

class OrderPanelWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      portfolio: '',
      type: 0,
      ticker: '',
      number: 0,
      price: 0
    };

    this.handlePortChange = this.handlePortChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleTickerSearch = this.handleTickerSearch.bind(this);
    this.handleNumberBlur = this.handleNumberBlur.bind(this);
    this.handlePriceBlur = this.handlePriceBlur.bind(this);
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this);
  }

  handlePortChange(e, val) {
    console.log("port", val.value);
    this.setState({ portfolio: val.value });
  }

  handleRadioChange(e) {
    this.setState({ type: Number(e.target.value) });
  }

  handleTickerSearch(e, val) {
    this.setState({ ticker: val.value });
  }

  handleNumberBlur(e) {
    if (!numericCheck.test(e.target.value)) {
      window.alert("Please enter whole share numbers only");
    }
    this.setState({ number: Number(e.target.value) });
  }

  handlePriceBlur(e) {
    if (!numericCheck.test(e.target.value)) {
      window.alert("Please enter a dollar amount (e.g. 450)");
    }
    this.setState({ price: Number(e.target.value) });
  }

  handlePlaceOrder() {
    // TODO: checks
    this.props.handlePlaceOrder({
      username: this.props.username,
      portfolio: this.state.portfolio,
      type: this.state.type,
      ticker: this.state.ticker,
      number: this.state.number,
      price: this.state.price
    });

    // reset fields
    this.setState({
      portfolio: '',
      type: 0,
      ticker: '',
      number: 0,
      price: 0
    });

    // update orders
    this.props.handleGetAllStocks();
    this.props.handleGetOrders({ username : this.props.username });
  }

  render() {
    const ports = this.props.portfolios.length > 0 ? this.props.portfolios.map((port, id) => ({
      key: id,
      value: port.name,
      text: port.name
    })) : [];

    return (
      <ViewCol style={styles.container}>
        <h1>Buy & Sell</h1>
        <Form>
          <ViewRow style={{alignItems: 'center', marginTop: '1rem', marginBottom: '1rem'}}>

            {/* Select Portfolio */}
            <Form.Field style={{ width: 200 }}>
              <label style={{marginRight: '1rem'}}>Portfolio:</label>
              <Dropdown
                button
                className='icon'
                floating
                labeled
                icon='world'
                options={ports}
                search
                text={this.state.portfolio ? this.state.portfolio : 'Portfolios'}
                onChange={this.handlePortChange}
              />
            </Form.Field>

            {/* Toggle Buy/Sell */}
            <Form.Field style={{ display: 'flex', width: 100 }}>
              <input
                type="radio"
                id="buyChoice"
                name="type"
                value={0}
                onChange={this.handleRadioChange}
                checked={this.state.type === 0}
              />
              <label
                style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
                htmlFor="buyChoice">
                Buy
              </label>

              <input
                type="radio"
                id="sellChoice"
                name="type"
                value={1}
                onChange={this.handleRadioChange}
                checked={this.state.type === 1}
              />
              <label
                style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
                htmlFor="sellChoice">
                Sell
              </label>
            </Form.Field>
          </ViewRow>

          <ViewRow >
            <Form.Field>
              <label>Ticker Symbol</label>
              <Dropdown
                button
                className='icon'
                floating
                labeled
                icon='world'
                options={this.props.symbols}
                search
                text={this.state.ticker ? this.state.ticker : 'Symbol'}
                onChange={this.handleTickerSearch}
              />
            </Form.Field>

            <Form.Field style={{ marginLeft: '1rem' }}>
              <label># Shares</label>
              <input placeholder="e.g. 20" onBlur={this.handleNumberBlur} />
            </Form.Field>

            <Form.Field style={{ marginLeft: '1rem' }}>
              <label>Price/Share</label>
              <input placeholder="e.g. 450" onBlur={this.handlePriceBlur} />
            </Form.Field>
          </ViewRow>

          <ViewRow style={{justifyContent: 'space-between'}}>
            <p>Total: {(this.state.number && this.state.price) ? this.state.number * this.state.price : '0'}</p>
            <button onClick={this.handlePlaceOrder}>Place Order</button>
          </ViewRow>
        </Form>
      </ViewCol>
    )
  }
}

const mapStateToProps = ({ Portfolio, Stocks, Login }) => {
  return {
    portfolios: Portfolio.portfolios,
    symbols: Stocks.symbols,
    username: Login.username
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...portfolioActions}, dispatch);
};

const OrderPanel = connect(mapStateToProps, mapDispatchToProps)(OrderPanelWrapper);

export default OrderPanel;
