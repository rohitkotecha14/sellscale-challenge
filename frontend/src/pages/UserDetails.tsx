import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import StyledButton from '../components/StyledButton';
import { getCurrentUser, deleteUser } from '../services/auth';  // Import deleteUser API
import { updateWalletBalance } from '../services/wallet';  
import { useNavigate } from 'react-router-dom';  

interface UserDetailsProps {
  walletBalance: number | null;
  setWalletBalance: React.Dispatch<React.SetStateAction<number | null>>;  // Update wallet balance in parent
}

const UserDetails: React.FC<UserDetailsProps> = ({ walletBalance, setWalletBalance }) => {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);  // Store the user data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getCurrentUser();  // Fetch the current user data
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user details', err);
      }
    };

    fetchUserDetails();
  }, []);

  const handleAdd = async () => {
    if (amount < 0) {
      setError('Amount cannot be negative.');
      return;
    }

    try {
      const newBalance = walletBalance! + amount;
      await updateWalletBalance(newBalance);
      setWalletBalance(newBalance);  // Update wallet balance
      setError('');
    } catch (err) {
      console.error('Failed to update balance', err);
    }
  };

  const handleWithdraw = async () => {
    if (amount < 0 || walletBalance! - amount < 0) {
      setError('Insufficient balance.');
      return;
    }

    try {
      const newBalance = walletBalance! - amount;
      await updateWalletBalance(newBalance);
      setWalletBalance(newBalance);  // Update wallet balance
      setError('');
    } catch (err) {
      console.error('Failed to update balance', err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser();  // Call the delete API
      navigate('/login');  // Redirect to login page after deletion
    } catch (err) {
      console.error('Failed to delete user account', err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        background: 'linear-gradient(135deg, #0d2e16 0%, #176032 100%)',  // Gradient background
      }}
    >
      <Box
        sx={{
          maxWidth: 600,  // Increase size for better readability
          width: '100%',
          padding: 5,  // Increase padding for spacing
          background: 'rgba(255, 255, 255, 0.1)',  // Transparent background
          borderRadius: 4,  // Increased border-radius for a smoother look
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',  // Enhanced shadow
          backdropFilter: 'blur(10px)',  // Glass effect
          border: '1px solid rgba(255, 255, 255, 0.2)',  // Subtle border
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" align="center" gutterBottom sx={{ color: '#34be10', marginBottom: 3 }}>
          User Details
        </Typography>

        {user && (
          <>
            <Typography variant="h5" sx={{ color: '#ffffff', marginBottom: 2 }}>
              <strong>First Name:</strong> {user.first_name}
            </Typography>

            <Typography variant="h5" sx={{ color: '#ffffff', marginBottom: 2 }}>
              <strong>Last Name:</strong> {user.last_name}
            </Typography>

            <Typography variant="h5" sx={{ color: '#ffffff', marginBottom: 2 }}>
              <strong>Email:</strong> {user.email}
            </Typography>
          </>
        )}

        <Typography variant="h5" sx={{ color: '#34be10', marginBottom: 3 }}>
          <strong>Wallet Balance:</strong> ${walletBalance?.toFixed(2)}
        </Typography>

        <TextField 
          fullWidth
          label="Enter Amount" 
          value={amount} 
          onChange={(e) => setAmount(Number(e.target.value))} 
          sx={{
            marginBottom: 3,
            backgroundColor: '#0d2e16',  // Darker input background for better contrast
            borderRadius: '4px',  // Slightly rounded input field
            '& .MuiInputBase-input': {
              color: '#34be10',  // Light green text inside input
            },
            '& .MuiOutlinedInput-root fieldset': {
              borderColor: '#34be10',  // Green border
            },
            '& .MuiInputLabel-root': {
              color: '#34be10',  // Green label text
            },
          }}
        />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', marginBottom: 2 }}>
          <StyledButton onClick={handleAdd} customColor="#38c804">
            ADD
          </StyledButton>
          <StyledButton onClick={handleWithdraw} customColor="#ff1744">
            WITHDRAW
          </StyledButton>
        </Box>
        
        {/* Add Delete Account Button */}
        <StyledButton onClick={handleDeleteAccount} customColor="#d32f2f">
          DELETE ACCOUNT
        </StyledButton>

        {error && <Typography color="error">{error}</Typography>}

      </Box>
    </Box>
  );
};

export default UserDetails;
