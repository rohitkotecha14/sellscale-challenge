import React, { useState } from 'react';
import { TextField, Button, Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  // For back button icon
import { registerUser } from '../services/auth';  // Ensure this path is correct
import { useAuth } from '../contexts/AuthContext';  // Import the AuthContext for login

interface RegisterProps {
  refreshWalletBalance: () => Promise<void>;  // Pass refreshWalletBalance as prop
}

const Register: React.FC<RegisterProps> = ({ refreshWalletBalance }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();  // Access the login function from the AuthContext

  // Email validation regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateFields = () => {
    if (!firstName || !lastName || !email || !username || !password) {
      setError('All fields are required.');
      return false;
    }
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };
  
  const handleRegister = async () => {
    // Clear any previous error
    setError('');
  
    // Validate the input fields before proceeding
    if (!validateFields()) return;
  
    setLoading(true);  // Set loading to true when request starts
    try {
      await registerUser(username, password, firstName, lastName, email);
      // Automatically log the user in after successful registration
      await auth.login(username, password);
      await refreshWalletBalance();
      // Redirect to the portfolio/landing page after login
      navigate('/');
    } catch (err: any) {
      // Handle backend errors
      if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  // Redirect to Login page
  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0d2e16 0%, #176032 100%)',  // Dark-to-light gradient
        flexDirection: 'column',  // Centers logo and form vertically
      }}
    >
      {/* Back button at the top left */}
      <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
        <IconButton
          onClick={handleBackToLogin}
          sx={{
            color: '#38c804',  // Green color for back button
            '&:hover': { color: '#ffffff' },  // White color on hover
          }}
        >
          <ArrowBackIcon />  {/* Back arrow icon */}
        </IconButton>
      </Box>

      {/* Larger image at the top */}
      <Box sx={{ marginBottom: 3 }}>
        <img 
          src="../../images/logo.png"  // Replace with your logo image
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
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',  // Glass effect shadow
          backdropFilter: 'blur(10px)',  // Glass effect blur
          border: '1px solid rgba(255, 255, 255, 0.2)',  // Subtle border
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: 'center', fontWeight: 'bold', color: '#ffffff' }}  // White text for contrast
        >
          Register
        </Typography>

        <TextField
          fullWidth
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          sx={{
            marginBottom: 2,
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
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={{
            marginBottom: 2,
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
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            marginBottom: 2,
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
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            marginBottom: 2,
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
            marginBottom: 2,
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
          onClick={handleRegister}
          disabled={loading}
          sx={{
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#38c804',  // Light green button
            '&:hover': {
              backgroundColor: '#176032',  // Dark green on hover
            },
            fontWeight: 'bold',
            textTransform: 'none',
            color: '#ffffff',  // White text
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </Button>
      </Box>
    </Box>
  );
};

export default Register;