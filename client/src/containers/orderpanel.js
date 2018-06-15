import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form } from 'semantic-ui-react';
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
    this.handleTickerBlur = this.handleTickerBlur.bind(this);
    this.handleNumberBlur = this.handleNumberBlur.bind(this);
    this.handlePriceBlur = this.handlePriceBlur.bind(this);
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this);
  }

  handlePortChange(e) {
    // Todo: checks
    this.setState({ portfolio: e.target.value });
  }

  handleRadioChange(e) {
    // Todo: checks
    this.setState({ type: Number(e.target.value) });
  }

  handleTickerBlur(e) {
    // Todo: checks
    this.setState({ ticker: e.target.value });
  }

  handleNumberBlur(e) {
    // Todo: checks
    this.setState({ number: Number(e.target.value) });
  }

  handlePriceBlur(e) {
    // Todo: checks
    this.setState({ price: Number(e.target.value) });
  }

  handlePlaceOrder() {
    // TODO: checks
    this.props.handlePlaceOrder({
      portfolio: this.state.portfolio,
      type: this.state.type,
      ticker: this.state.ticker,
      number: this.state.number,
      price: this.state.price
    });
  }

  render() {
    return (
      <ViewCol style={styles.container}>
        <h1>Buy & Sell</h1>
        <Form>
          <ViewRow style={{marginTop: '1rem', marginBottom: '1rem'}}>
            <Form.Field style={{ display: 'flex', width: 200 }}>
              <label style={{marginRight: '1rem'}}>Portfolio:</label>
              <select style={{ width: 100 }} onChange={this.handlePortChange}>
                {this.props.portfolios.map((port, id) => (
                  <option key={id} value={port.name}>{port.name}</option>
                ))}
              </select>
            </Form.Field>

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

          <ViewRow>
            <Form.Field>
              <label>Ticker Symbol</label>
              <input placeholder="e.g. APPL" onBlur={this.handleTickerBlur} />
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

const mapStateToProps = ({ Portfolio }) => {
  return {
    portfolios: Portfolio.portfolios
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...portfolioActions}, dispatch);
};

const OrderPanel = connect(mapStateToProps, mapDispatchToProps)(OrderPanelWrapper);

export default OrderPanel;
