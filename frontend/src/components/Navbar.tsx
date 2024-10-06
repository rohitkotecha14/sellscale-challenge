import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // Import the authentication context

const Navbar = () => {
  const { isAuthenticated, logout, user, fetchCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="static"
      sx={{ background: 'linear-gradient(135deg, #0d2e16 0%, #176032 100%)' }}  // Dark-to-light green gradient
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Left section with Logo and Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Logo Image */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img 
              src="../../images/logo.png"  // Replace with your logo's src
              alt="SellScaleHood" 
              style={{ width: '120px', height: 'auto' }}  // Adjust size as necessary
            />
          </Link>

          {/* Links next to logo */}
          <Button 
            color="inherit" 
            component={Link} 
            to="/" 
            sx={{
              color: '#ffffff', 
              fontWeight: 'bold',
              fontSize: '1.1rem',
              fontFamily: "'Roboto', sans-serif",  // Font change
              textTransform: 'none',  // Prevent uppercase text
              '&:hover': { color: '#38c804' },  // Bright green hover color
              '&:focus': { color: '#2fa503' },  // Slightly darker on focus
            }}
          >
            Home
          </Button>

          <Button 
            color="inherit" 
            component={Link} 
            to="/stocks" 
            sx={{
              color: '#38c804', 
              fontWeight: 'bold',
              fontSize: '1.1rem',
              fontFamily: "'Roboto', sans-serif",  // Font change
              textTransform: 'none',  // Prevent uppercase text
              '&:hover': { color: '#38c804' },  // Bright green hover color
              '&:focus': { color: '#2fa503' },  // Slightly darker on focus
            }}
          >
            Stocks
          </Button>
        </Box>

        {/* Right section with user actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Button to Fetch Current User */}
          {isAuthenticated && (
            <Button color="inherit" onClick={fetchCurrentUser} sx={{ color: '#ffffff' }}>
              {user ? `Current User: ${user}` : 'Fetch Current User'}
            </Button>
          )}

          {/* Right-Aligned Logout Button */}
          {isAuthenticated && (
            <Button 
              color="inherit" 
              onClick={handleLogout} 
              sx={{ 
                color: '#ffffff', 
                fontWeight: 'bold',
                fontFamily: "'Roboto', sans-serif",  // Font change
                '&:hover': { color: '#ff1744' },  // Bright red on hover for logout
                '&:focus': { color: '#d50000' }   // Slightly darker red on focus
              }}
            >
              Logout
            </Button>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
