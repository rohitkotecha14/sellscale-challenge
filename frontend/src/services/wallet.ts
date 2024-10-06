import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Fetch the wallet balance of the current user
export const getWalletBalance = async () => {
    const response = await axios.get(`${BASE_URL}/user/wallet`, { withCredentials: true });
    return response.data;  // Return the wallet balance
  };
  
// Update the wallet balance of the current user using query parameter
export const updateWalletBalance = async (newBalance: number) => {
const response = await axios.put(`${BASE_URL}/user/wallet?new_balance=${newBalance}`, {}, { withCredentials: true });
return response.data;  // Return the updated balance or success message
};
