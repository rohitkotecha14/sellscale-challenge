import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Login function with error handling
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, { username, password }, { withCredentials: true });

    if (response.status !== 200) {
      throw new Error('Login failed');
    }

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      throw new Error('Invalid username or password.');
    } else {
      console.error('Error during login:', error);
      throw new Error('Failed to login. Please try again later.');
    }
  }
};

// Register function with error handling
export const registerUser = async (username: string, password: string, first_name: string, last_name: string, email: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/register`, { username, password, first_name, last_name, email }, { withCredentials: true });

    if (response.status !== 200) {
      throw new Error('Registration failed');
    }

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      throw new Error('User already exists or invalid data.');
    } else {
      console.error('Error during registration:', error);
      throw new Error('Failed to register. Please try again later.');
    }
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
      throw new Error('Logout failed');
    }

    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return response.data;
  } catch (error: any) {
    console.error('Error during logout:', error);
    throw new Error('Failed to logout. Please try again later.');
  }
};

// Get current user with error handling
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/me`, { withCredentials: true });

    if (response.status !== 200) {
      throw new Error('Not authenticated');
    }

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error('You are not authenticated. Please login.');
    } else {
      console.error('Error fetching current user:', error);
      throw new Error('Failed to fetch current user.');
    }
  }
};

// Delete user with error handling
export const deleteUser = async () => {
  try {
    const response = await axios.delete(`${BASE_URL}/user/delete`, { withCredentials: true });

    if (response.status !== 204) {
      throw new Error('Failed to delete user');
    }

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('User not found.');
    } else {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user. Please try again later.');
    }
  }
};
