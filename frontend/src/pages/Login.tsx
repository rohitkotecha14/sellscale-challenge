import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await auth.login(username, password);
      navigate('/');  // Redirect to main content after login
    } catch (err) {
      setError('Login failed. Please check your credentials.');
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
          sx={{
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#38c804',  // Light green button
            '&:hover': {
              backgroundColor: '#176032',  // Dark green on hover
            },
            marginBottom: 2,
            fontWeight: 'bold',
            textTransform: 'none',
            color: '#ffffff',  // White text
          }}
        >
          Login
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
