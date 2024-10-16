import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  walletBalance: number | null;  // Pass walletBalance as prop
}

const Navbar: React.FC<NavbarProps> = ({ walletBalance }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="static"
      sx={{ background: 'linear-gradient(135deg, #0d2e16 0%, #176032 100%)' }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Left section with Logo and Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img 
              src="../../images/logo.png"  
              alt="SellScaleHood" 
              style={{ width: '120px', height: 'auto' }}  
            />
          </Link>

          <Button 
            color="inherit" 
            component={Link} 
            to="/" 
            sx={{
              color: '#ffffff', 
              fontWeight: 'bold',
              fontSize: '1.1rem',
              fontFamily: "'Roboto', sans-serif",
              textTransform: 'none',
              '&:hover': { color: '#38c804' },
              '&:focus': { color: '#2fa503' },
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
              fontFamily: "'Roboto', sans-serif", 
              textTransform: 'none',
              '&:hover': { color: '#38c804' },
              '&:focus': { color: '#2fa503' },
            }}
          >
            Stocks
          </Button>
        </Box>

        {/* Right section with Profile and Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {isAuthenticated && (
            <Box sx={{ textAlign: 'right' }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/user-details" 
                sx={{ color: '#ffffff', fontWeight: 'bold' }}
              >
                Profile
              </Button>
              {/* Display wallet balance under the Profile button */}
              {walletBalance !== null && (
                <Typography 
                  variant="body2" 
                  sx={{ color: '#38c804', fontSize: '0.85rem' }}
                >
                  Wallet: ${walletBalance.toFixed(2)}
                </Typography>
              )}
            </Box>
          )}

          {isAuthenticated && (
            <Button 
              color="inherit" 
              onClick={handleLogout} 
              sx={{ 
                color: '#ffffff', 
                fontWeight: 'bold',
                fontFamily: "'Roboto', sans-serif",  
                '&:hover': { color: '#ff1744' },
                '&:focus': { color: '#d50000' }
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
