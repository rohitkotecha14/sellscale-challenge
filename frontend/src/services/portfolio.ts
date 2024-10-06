import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// API to view the current user's portfolio
export const viewPortfolio = async () => {
  const response = await axios.get(`${BASE_URL}/portfolio/view`, { withCredentials: true });
  return response.data;
};

// API to buy stock
export const buyStock = async (ticker: string, quantity: number) => {
  const response = await axios.post(`${BASE_URL}/portfolio/buy`, { ticker, quantity }, { withCredentials: true });
  return response.data;
};

// API to sell stock
export const sellStock = async (ticker: string, quantity: number) => {
  const response = await axios.post(`${BASE_URL}/portfolio/sell`, { ticker, quantity }, { withCredentials: true });
  return response.data;
};
