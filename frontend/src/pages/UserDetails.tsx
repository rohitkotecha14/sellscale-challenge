import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import StyledButton from '../components/StyledButton';
import { getCurrentUser } from '../services/auth';  // Import the service to fetch user details
import { updateWalletBalance } from '../services/wallet';  

interface UserDetailsProps {
  walletBalance: number | null;
  setWalletBalance: React.Dispatch<React.SetStateAction<number | null>>;  // Update wallet balance in parent
}

const UserDetails: React.FC<UserDetailsProps> = ({ walletBalance, setWalletBalance }) => {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);  // Store the user data

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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        background: 'linear-gradient(135deg, #0d2e16 0%, #176032 100%)',  // Same gradient as other pages
      }}
    >
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
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#34be10' }}>
          User Details
        </Typography>

        {user && (
          <>
            <Typography variant="body1" sx={{ color: '#ffffff' }}>
              <strong>First Name:</strong> {user.first_name}
            </Typography>

            <Typography variant="body1" sx={{ color: '#ffffff' }}>
              <strong>Last Name:</strong> {user.last_name}
            </Typography>

            <Typography variant="body1" sx={{ color: '#ffffff' }}>
              <strong>Email:</strong> {user.email}
            </Typography>
          </>
        )}

        <Typography variant="body1" sx={{ color: '#ffffff' }}>
          <strong>Wallet Balance:</strong> ${walletBalance?.toFixed(2)}
        </Typography>

        <TextField 
          label="Enter Amount" 
          value={amount} 
          onChange={(e) => setAmount(Number(e.target.value))} 
          sx={{ marginBottom: 2, backgroundColor: '#0d2e16', color: '#ffffff' }}
          inputProps={{ style: { color: '#34be10' } }}  // White text color inside input
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <StyledButton onClick={handleAdd} customColor="#38c804">
            Add
          </StyledButton>
          <StyledButton onClick={handleWithdraw} customColor="#f44336">
            Withdraw
          </StyledButton>
        </Box>
        
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Box>
  );
};

export default UserDetails;
