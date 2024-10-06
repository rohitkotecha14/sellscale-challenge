import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  refreshWalletBalance: () => Promise<void>;  // Pass refreshWalletBalance as prop
}

const Login: React.FC<LoginProps> = ({ refreshWalletBalance }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state to handle premature redirects
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);  // Set loading to true when login starts
    setError('');  // Clear any previous error

    try {
      await auth.login(username, password);  // This should throw an error if login fails
      await refreshWalletBalance();
      setLoading(false);  // Set loading to false after login success
      navigate('/');  // Redirect to main content only after successful login
    } catch (err: any) {
      setLoading(false);  // Ensure loading is false if there's an error
      console.log(err)
      if (err.message) {
        // Check if the error has a general message
        setError(err.message);
      } else {
        // Fallback for any unexpected errors
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  // Redirect to Register page
  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0d2e16 0%, #176032 100%)',  // Darker gradient
        flexDirection: 'column',  // Center image and form vertically
      }}
    >
      {/* Larger image at the top */}
      <Box sx={{ marginBottom: 3 }}>
        <img 
          src="../../images/logo.png"  // Replace with your image URL
          alt="App Name"
          style={{ width: '250px', height: 'auto' }}  // Increased image size
        />
      </Box>

      <Box
        sx={{
          maxWidth: 400,
          width: '100%',
          padding: 4,
          background: 'rgba(255, 255, 255, 0.1)',  // Transparent background
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',  // Strong shadow for depth
          backdropFilter: 'blur(10px)',  // More blur for glass effect
          border: '1px solid rgba(255, 255, 255, 0.2)',  // Light border for modern look
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: 'center', fontWeight: 'bold', color: '#ffffff' }}  // White text for contrast
        >
          Login
        </Typography>

        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            marginBottom: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '& fieldset': {
                borderColor: '#38c804',  // Light green border
              },
              '&:hover fieldset': {
                borderColor: '#ffffff',  // White border on hover
              },
            },
            '& .MuiInputLabel-root': {
              color: '#ffffff',  // White label text
            },
            '& .MuiInputBase-input': {
              color: '#ffffff',  // White input text
            },
          }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            marginBottom: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '& fieldset': {
                borderColor: '#38c804',  // Light green border
              },
              '&:hover fieldset': {
                borderColor: '#ffffff',  // White border on hover
              },
            },
            '& .MuiInputLabel-root': {
              color: '#ffffff',  // White label text
            },
            '& .MuiInputBase-input': {
              color: '#ffffff',  // White input text
            },
          }}
        />

        {/* Display error message */}
        {error && (
          <Typography
            color="error"
            gutterBottom
            sx={{ textAlign: 'center', marginBottom: 2 }}
          >
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          disabled={loading}  // Disable button while loading
          sx={{
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: loading ? '#a1a1a1' : '#38c804',  // Light green button, grey when loading
            '&:hover': {
              backgroundColor: loading ? '#a1a1a1' : '#176032',  // Dark green on hover
            },
            marginBottom: 2,
            fontWeight: 'bold',
            textTransform: 'none',
            color: '#ffffff',  // White text
          }}
        >
          {loading ? 'Logging in...' : 'Login'}  {/* Show loading text */}
        </Button>

        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ marginTop: 2, color: '#ffffff' }}  // White for text contrast
        >
          New user?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={handleRegisterRedirect}
            sx={{
              color: '#38c804',  // Light green for the register link
              fontWeight: 'bold',
              '&:hover': {
                color: '#ffffff',  // White on hover
              },
            }}
          >
            Register here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
