import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// API to query stock information by ticker symbol
export const queryStock = async (ticker: string) => {
  const response = await axios.get(`${BASE_URL}/stock/query/${ticker}`, { withCredentials: true });
  return response.data;
};
