import {
  HANDLE_CREATE_PORTFOLIO_SUCCESS,
  HANDLE_DELETE_PORTFOLIO_SUCCESS,
  HANDLE_GET_ORDERS_SUCCESS,
  HANDLE_PLACE_ORDER_FAILURE,
  HANDLE_PLACE_ORDER_SUCCESS,
  HANDLE_CANCEL_ORDER_SUCCESS,

  // from IPO actions
  HANDLE_NEW_IPO_SUCCESS
} from '../actions/constants';

const initialState = {
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
  ],

  // for portfolio page
  orders: [],

  // for stock trends page
  allOrders: []
};

const Portfolio = (state = initialState, action) => {
  switch(action.type) {

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
