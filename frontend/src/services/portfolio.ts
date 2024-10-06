import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Helper function to handle API errors consistently
const handleApiError = (error: any, defaultMessage: string) => {
  if (error.response) {
    if (error.response.status === 400) {
      throw new Error('Invalid request. Please check your input and try again.');
    } else if (error.response.status === 401) {
      throw new Error('Unauthorized. Please login and try again.');
    } else if (error.response.status === 404) {
      throw new Error('Resource not found.');
    } else {
      console.error(`API Error ${error.response.status}:`, error.response.data);
      throw new Error(error.response.data?.detail || defaultMessage);
    }
  } else {
    console.error('Network/Server Error:', error);
    throw new Error(defaultMessage);
  }
};

// API to view the current user's portfolio with error handling
export const viewPortfolio = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/portfolio/view`, { withCredentials: true });
    if (response.status !== 200) {
      throw new Error('Failed to retrieve portfolio.');
    }
    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to retrieve portfolio. Please try again later.');
  }
};

// API to buy stock with error handling
export const buyStock = async (ticker: string, quantity: number) => {
  try {
    const response = await axios.post(`${BASE_URL}/portfolio/buy`, { ticker, quantity }, { withCredentials: true });
    if (response.status !== 200) {
      throw new Error('Failed to buy stock.');
    }
    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to buy stock. Please try again later.');
  }
};

// API to sell stock with error handling
export const sellStock = async (ticker: string, quantity: number) => {
  try {
    const response = await axios.post(`${BASE_URL}/portfolio/sell`, { ticker, quantity }, { withCredentials: true });
    if (response.status !== 200) {
      throw new Error('Failed to sell stock.');
    }
    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to sell stock. Please try again later.');
  }
};
