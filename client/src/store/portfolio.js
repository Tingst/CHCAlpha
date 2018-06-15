import {
  HANDLE_CREATE_PORTFOLIO_SUCCESS,
  HANDLE_DELETE_PORTFOLIO_SUCCESS
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

    default: {
      return state;
    }

  }
};

export default Portfolio;
