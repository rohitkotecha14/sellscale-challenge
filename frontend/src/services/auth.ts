import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Helper function to handle API errors consistently
const handleApiError = (error: any, defaultMessage: string) => {
  if (error.response) {
    if (error.response.status === 400) {
      throw new Error(error.response.data.detail);
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

// Login function with error handling
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, { username, password }, { withCredentials: true });
    if (response.status !== 200) {
      throw new Error('Failed to login. Please try again.');
    }
    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to login. Please try again later.');
  }
};


// Register function with error handling
export const registerUser = async (username: string, password: string, first_name: string, last_name: string, email: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/register`, { username, password, first_name, last_name, email }, { withCredentials: true });
    if (response.status !== 200) {
      throw new Error('Registration failed.');
    }
    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to register. Please try again later.');
  }
};

// Logout function with error handling
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/user/logout`, {}, {
      method: 'GET',
      withCredentials: true
    });
    if (response.status !== 200) {
      throw new Error('Logout failed.');
    }

    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to logout. Please try again later.');
  }
};

// Get current user with error handling
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/me`, { withCredentials: true });
    if (response.status !== 200) {
      throw new Error('Failed to authenticate user.');
    }
    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to fetch current user.');
  }
};

// Delete user with error handling
export const deleteUser = async () => {
  try {
    const response = await axios.delete(`${BASE_URL}/user/delete`, { withCredentials: true });
    if (response.status !== 204) {
      throw new Error('Failed to delete user.');
    }
    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to delete user. Please try again later.');
  }
};
