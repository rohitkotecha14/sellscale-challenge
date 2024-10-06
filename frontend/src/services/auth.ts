import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Existing functions...
export const loginUser = async (username: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/user/login`, { username, password }, { withCredentials: true });
  return response.data;
};

export const registerUser = async (username: string, password: string, first_name: string, last_name: string, email: string) => {
  const response = await axios.post(`${BASE_URL}/user/register`, { username, password, first_name, last_name, email }, { withCredentials: true });
  return response.data;
};

// Add the logout function to call the backend logout route
export const logoutUser = async () => {
  const response = await axios.post(`${BASE_URL}/user/logout`, {}, {
    method: 'GET',
    withCredentials: true
  });
  return response.data;
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/me`, { withCredentials: true });

    if (response.status !== 200) {
      throw new Error('Not authenticated');
    }

    return response.data;  // Return user data
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;  // Throw error to be caught in the AuthContext
  }
};
