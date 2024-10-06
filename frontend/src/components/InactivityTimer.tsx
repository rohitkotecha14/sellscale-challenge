import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Assuming you're using an AuthContext

const InactivityTimer = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  let timeoutId: NodeJS.Timeout;

  // Set the inactivity timeout period (e.g., 5 minutes = 5 * 60 * 1000)
  const INACTIVITY_TIME = 5 * 60 * 1000;  // 5 minutes

  const handleUserActivity = () => {
    // Clear the previous timeout if any activity is detected
    clearTimeout(timeoutId);

    // Set a new timeout to trigger auto logout
    timeoutId = setTimeout(() => {
      logoutUser();  // Call the logout function
    }, INACTIVITY_TIME);
  };

  const logoutUser = async () => {
    await logout();  // Perform logout
    navigate('/login');  // Redirect to login page
  };

  useEffect(() => {
    // Detect user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    // Initialize the timer when the component is mounted
    timeoutId = setTimeout(() => {
      logoutUser();
    }, INACTIVITY_TIME);

    // Cleanup the event listeners and timeout on component unmount
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
    };
  }, []);

  return null;  // This component doesn't render anything, it just manages the timer
};

export default InactivityTimer;
