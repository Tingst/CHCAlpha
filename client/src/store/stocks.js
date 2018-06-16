import {
  HANDLE_TRENDS_REFRESH_SUCCESS,
  HANDLE_GET_DETAILS_SUCCESS,

  // from IPO actions
  HANDLE_NEW_IPO_SUCCESS
} from '../actions/constants';

const initialState = {
  // Main Stock Panel
  stocks: [
    { ticker: 'APPL',   exchange: 'NASDAQ',  price: 100, industry: 'technology', companyName: 'Apple' },
    { ticker: 'GOOGL',  exchange: 'NASDAQ',  price: 220, industry: 'technology', companyName: 'Alphabet' },
    { ticker: 'TSLA',   exchange: 'NASDAQ',  price: 430, industry: 'automotive', companyName: 'Tesla' },
    { ticker: 'PFE',    exchange: 'NYSE',    price: 483, industry: 'pharmaceutical', companyName: 'Pfizer' },
    { ticker: 'GLAXO',  exchange: 'NSE',     price: 100, industry: 'pharmaceutical', companyName: 'GlaxoSmithKline' },
    { ticker: 'BAYN',   exchange: 'ETR',     price: 35,  industry: 'pharmaceutical', companyName: 'Bayer' },
    { ticker: 'BABA',   exchange: 'NYSE',    price: 56,  industry: 'ecommerce', companyName: 'Alibaba' },
    { ticker: 'BA',     exchange: 'NYSE',    price: 241, industry: 'aviation', companyName: 'Boeing' },
    { ticker: 'AMZN',   exchange: 'NASDAQ',  price: 449, industry: 'ecommerce', companyName: 'Amazon' }
  ],
  exchanges: [
    { key: 0, text: 'ALL', value: 'ALL' },
    { key: 1, text: 'NASDAQ', value: 'NASDAQ' },
    { key: 2, text: 'NYSE', value: 'NYSE' },
    { key: 3, text: 'TSX', value: 'TSX' },
    { key: 4, text: 'NIKKEI', value: 'NIKKEI' },
    { key: 5, text: 'INDEXDJX', value: 'INDEXDJX' }
  ],
  symbols: [
    { key: 1, text: 'APPL', value: 'APPL' },
    { key: 2, text: 'GOOGL', value: 'GOOGL' },
    { key: 3, text: 'TSLA', value: 'TSLA' },
    { key: 4, text: 'PFE', value: 'PFE' },
    { key: 5, text: 'GLAXO', value: 'GLAXO' },
    { key: 6, text: 'BAYN', value: 'BAYN' },
    { key: 7, text: 'BABA', value: 'BABA' },
    { key: 8, text: 'BA', value: 'BA' },
    { key: 9, text: 'AMZN', value: 'AMZN' }
  ],

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

    default: {
      return state;
    }

  }
};

export default Stocks;
