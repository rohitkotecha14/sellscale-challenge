import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { loginUser, logoutUser , getCurrentUser } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: string | null;  // Store the current username
  fetchCurrentUser: () => Promise<void>;  // Function to fetch the current user
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);  // Store the current user

  useEffect(() => {
    const checkSession = async () => {
      try {
        await fetchCurrentUser();  // Fetch user data from backend
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);  // If session invalid, set as not authenticated
        console.error('No active session found', err);
      }
    };
    checkSession();  // Run session check on page load
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await loginUser(username, password);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      setUser(null);  // Clear the current user on logout
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData.username);  // Assuming your API returns a `username` field
    } catch (err) {
      console.error('Failed to fetch current user', err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
