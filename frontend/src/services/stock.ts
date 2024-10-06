import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Helper function to handle API errors consistently
const handleApiError = (error: any, defaultMessage: string) => {
  if (error.response) {
    if (error.response.status === 400) {
      throw new Error('Invalid request. Please check your input and try again.');
    } else if (error.response.status === 429) {
      throw new Error('Rate limit exceeded!');
    } else if (error.response.status === 401) {
      throw new Error('Unauthorized. Please login and try again.');
    } else if (error.response.status === 404) {
      throw new Error('Stock ticker not found. Please check the ticker symbol and try again.');
    } else {
      console.error(`API Error ${error.response.status}:`, error.response.data);
      throw new Error(error.response.data?.detail || defaultMessage);
    }
  } else {
    console.error('Network/Server Error:', error);
    throw new Error(defaultMessage);
  }
};

// API to query stock information by ticker symbol with error handling
export const queryStock = async (ticker: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/stock/query/${ticker}`, { withCredentials: true });
    
    if (response.status !== 200) {
      throw new Error('Failed to retrieve stock information.');
    }

    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to retrieve stock information. Please try again later.');
  }
};


// New API to get stock chart data
export const getStockChart = async (ticker: string, period = '1mo', interval = '1d') => {
  try {
    const response = await axios.get(`${BASE_URL}/stock/chart/${ticker}`, {
      params: { period, interval },
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error('Failed to retrieve stock chart data.');
    }

    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to retrieve stock chart data. Please try again later.');
  }
};

export const searchCompany = async (companyName: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/stock/search/${companyName}`, { withCredentials: true });

    if (response.status !== 200) {
      throw new Error('Failed to search for company.');
    }

    return response.data.matches; // Assuming the backend returns a 'matches' array
  } catch (error: any) {
    handleApiError(error, 'Failed to search for company. Please try again later.');
  }
};