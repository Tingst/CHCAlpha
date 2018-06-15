import {
  HANDLE_CREATE_PORTFOLIO_SUCCESS,
  HANDLE_DELETE_PORTFOLIO_SUCCESS,
  HANDLE_ORDER_SUCCESS,
  HANDLE_CANCEL_ORDER_SUCCESS
} from '../actions/constants';

const initialState = {
  tree: 'bear',
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
  orders: [
    { id: 1332, type: 0, ticker: 'APPL', date: '08/06/18', number: 5, price: 100 },
    { id: 2515, type: 1, ticker: 'GOOGL', date: '08/06/18', number: 10, price: 1340 },
    { id: 5443, type: 1, ticker: 'AMZN', date: '08/06/18', number: 42, price: 1010 }
  ]
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

    case HANDLE_ORDER_SUCCESS: {
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

    default: {
      return state;
    }

  }
};

export default Portfolio;
