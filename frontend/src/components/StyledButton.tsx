import React from 'react';
import { Button, CircularProgress, SxProps } from '@mui/material';

interface StyledButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  customColor?: string;  // Custom background color for the button
  sx?: SxProps;  // Allow `sx` prop for custom styling
}

const StyledButton: React.FC<StyledButtonProps> = ({
  onClick,
  disabled,
  loading,
  children,
  fullWidth,
  customColor,
  sx,
}) => {
  return (
    <Button
      variant="contained"
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled}
      sx={{
        marginBottom: 2,
        backgroundColor: customColor || '#38c804',  // Use custom color if provided, fallback to default
        color: disabled ? '#a1a1a1' : '#ffffff',    // Light when disabled, white when enabled
        '&:hover': { backgroundColor: customColor ? '#2fa503' : '#2fa503' },  // Darker on hover
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',  // Subtle shadow
        '&:disabled': {
          backgroundColor: '#3d3d3d',  // Dark background when disabled
          color: '#a1a1a1',  // Light color when disabled
        },
        ...sx,  // Spread any custom styles passed via sx prop
      }}
    >
      {loading ? <CircularProgress size={24} /> : children}
    </Button>
  );
};

export default StyledButton;
