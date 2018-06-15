import {
  TEST_BEAR,
  HANDLE_TRENDS_REFRESH_SUCCESS
} from '../actions/constants';

const initialState = {
  stocks: [
    { ticker: 'APPL',   exchange: 'NASDAQ',  price: 100, companyName: 'Apple' },
    { ticker: 'GOOGL',  exchange: 'NASDAQ',  price: 220, companyName: 'Alphabet' },
    { ticker: 'TSLA',   exchange: 'NASDAQ',  price: 430, companyName: 'Tesla' },
    { ticker: 'PFE',    exchange: 'NYSE',    price: 483, companyName: 'Pfizer' },
    { ticker: 'GLAXO',  exchange: 'NSE',     price: 100, companyName: 'GlaxoSmithKline' },
    { ticker: 'BAYN',   exchange: 'ETR',     price: 35,  companyName: 'Bayer' },
    { ticker: 'BABA',   exchange: 'NYSE',    price: 56,  companyName: 'Alibaba' },
    { ticker: 'BA',     exchange: 'NYSE',    price: 241, companyName: 'Boeing' },
    { ticker: 'AMZN',   exchange: 'NASDAQ',  price: 449, companyName: 'Amazon' }
  ],
  stockTrendHighest: { ticker: 'APPL',   exchange: 'NASDAQ',  price: 100, companyName: 'Apple' },
  stockTrendLowest: { ticker: 'GLAXO',  exchange: 'NSE',     price: 100, companyName: 'GlaxoSmithKline' },
  stockTrendMostFrequent: { ticker: 'PFE',    exchange: 'NYSE',    price: 483, companyName: 'Pfizer' },
  stockTrendLeastFrequent: { ticker: 'BABA',   exchange: 'NYSE',    price: 56,  companyName: 'Alibaba' },

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
    default: {
      return state;
    }

  }
};

export default Stocks;
