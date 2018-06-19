import {
  HANDLE_CREATE_PORTFOLIO_SUCCESS,
  HANDLE_GET_PORTFOLIO_SUCCESS,
  HANDLE_DELETE_PORTFOLIO_SUCCESS,
  HANDLE_GET_ORDERS_SUCCESS,
  HANDLE_PLACE_ORDER_FAILURE,
  HANDLE_PLACE_ORDER_SUCCESS,
  HANDLE_CANCEL_ORDER_SUCCESS,

  // from IPO actions
  HANDLE_NEW_IPO_SUCCESS
} from '../actions/constants';

const initialState = {
  portfolios: [],

  // for portfolio page
  orders: [],

  // for stock trends page
  allOrders: []
};

const Portfolio = (state = initialState, action) => {
  switch(action.type) {

    case HANDLE_GET_PORTFOLIO_SUCCESS: {
      return {
        ...state,
        portfolios: action.portfolios
      };
    }

    case HANDLE_CREATE_PORTFOLIO_SUCCESS: {
      const newPortfolio = {
        name: action.payload.name,
        stocks: []
      };

      return {
        ...state,
        portfolios: [newPortfolio, ...state.portfolios]
      };
    }

    case HANDLE_DELETE_PORTFOLIO_SUCCESS: {
      const newPortfolios = state.portfolios.filter((port) => {
        return port.name !== action.payload.id;
      });

      return {
        ...state,
        portfolios: newPortfolios
      };
    }

    case HANDLE_GET_ORDERS_SUCCESS: {
      // update orders for the stock trends page
      if (action.payload.username === "*") {
        return {
          ...state,
          allOrders: action.payload.allOrders
        };
      }

      // update orders for this user
      return {
        ...state,
        orders: action.payload.orders
      };
    }

    case HANDLE_PLACE_ORDER_SUCCESS: {
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };
    }

    case HANDLE_CANCEL_ORDER_SUCCESS: {
      const newOrders = state.orders.filter((order) => {
        return order.id !== action.payload.id;
      });

      return {
        ...state,
        orders: newOrders
      };
    }

    case HANDLE_NEW_IPO_SUCCESS: {
      // assign IPO shares to owner
      const newStock = {
        ticker: action.payload.ticker,
        exchange: action.payload.exchange,
        numShares: action.payload.numShares,
        purchasePrice: action.payload.price,
        currentPrice: action.payload.currentPrice
      };

      const newPortfolio = { ...state.portfolios.find(port => port.name === action.payload.portfolio)};
      newPortfolio.stocks.push(newStock);

      return {
        ...state,
        portfolios: [
          ...state.portfolios.filter(port => port.name !== action.payload.portfolio),
          newPortfolio
        ]
      }
    }

    default: {
      return state;
    }

  }
};

export default Portfolio;
