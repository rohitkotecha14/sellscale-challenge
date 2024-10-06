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

// Fetch the wallet balance of the current user with error handling
export const getWalletBalance = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/wallet`, { withCredentials: true });
    if (response.status !== 200) {
      throw new Error('Failed to retrieve wallet balance.');
    }
    return response.data;  // Return the wallet balance
  } catch (error: any) {
    handleApiError(error, 'Failed to retrieve wallet balance. Please try again later.');
  }
};

// Update the wallet balance of the current user using query parameter with error handling
export const updateWalletBalance = async (newBalance: number) => {
  try {
    const response = await axios.put(`${BASE_URL}/user/wallet?new_balance=${newBalance}`, {}, { withCredentials: true });
    if (response.status !== 200) {
      throw new Error('Failed to update wallet balance.');
    }
    return response.data;  // Return the updated balance or success message
  } catch (error: any) {
    handleApiError(error, 'Failed to update wallet balance. Please try again later.');
  }
};
