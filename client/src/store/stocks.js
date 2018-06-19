import {
  HANDLE_GET_ALL_STOCKS_SUCCESS,
  HANDLE_GET_ALL_STOCKS_FAILURE,
  HANDLE_TRENDS_REFRESH_SUCCESS,
  HANDLE_GET_DETAILS_SUCCESS,

  // from IPO actions
  HANDLE_NEW_IPO_SUCCESS,
  HANDLE_LOGOUT
} from '../actions/constants';

const initialState = {
  // Main Stock Panel
  stocks: [],
  exchanges: [],
  symbols: [],

  // Stock Trends
  stockTrendHighest: { ticker: 'APPL',   exchange: 'NASDAQ',  price: 100, industry: 'technology', companyName: 'Apple' },
  stockTrendLowest: { ticker: 'GLAXO',  exchange: 'NSE',     price: 100, industry: 'pharmaceutical', companyName: 'GlaxoSmithKline' },
  stockTrendMostFrequent: { ticker: 'PFE',    exchange: 'NYSE',    price: 483, industry: 'pharmaceutical', companyName: 'Pfizer' },
  stockTrendLeastFrequent: { ticker: 'BABA',   exchange: 'NYSE',    price: 56,  industry: 'technology', companyName: 'Alibaba' },

  // Stock Details
  selected: {
    ticker: 'APPL',
    exchange: 'NASDAQ',
    price: 100,
    industry: 'technology',
    companyName: 'Apple'
  }
};

const Stocks = (state = initialState, action) => {
  switch(action.type) {

    case HANDLE_GET_ALL_STOCKS_SUCCESS: {
      return {
        ...state,
        stocks: action.payload.stocks,
        exchanges: action.payload.exchanges,
        symbols: action.payload.symbols
      }
    }

    case HANDLE_TRENDS_REFRESH_SUCCESS: {
      const {
        stockTrendHighest,
        stockTrendLowest,
        stockTrendMostFrequent,
        stockTrendLeastFrequent
      } = action.payload;

      return {
        ...state,
        stockTrendHighest,
        stockTrendLowest,
        stockTrendMostFrequent,
        stockTrendLeastFrequent
      };
    }

    case HANDLE_GET_DETAILS_SUCCESS: {
      const selected = state.stocks.find(stock => stock.ticker === action.payload.ticker);

      return { ...state, selected };
    }

    case HANDLE_NEW_IPO_SUCCESS: {
      const newStock = {
        ticker: action.payload.ticker,
        exchange: action.payload.exchange,
        price: action.payload.price,
        industry: action.payload.industry,
        companyName: action.payload.name
      };

      return {
        ...state,
        stocks: [ ...state.stocks, newStock ]
      };
    }


    case HANDLE_LOGOUT: {
      return initialState;
    }

    default: {
      return state;
    }

  }
};

export default Stocks;
