import React from 'react';
import { Box, Typography } from "@mui/material";

interface StockInfoDisplayProps {
  stockInfo: any;
  stockQuantity: number | null;
}

const StockInfoDisplay: React.FC<StockInfoDisplayProps> = ({ stockInfo, stockQuantity }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',  // Center content vertically
        alignItems: 'center',      // Center content horizontally
        textAlign: 'center',       // Center text
        width: '100%',             // Make it take full width
        padding: 3                 // Add some padding around the content
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: "#34be10", fontWeight: 'bold' }}>
        Stock Information for {stockInfo.ticker}
      </Typography>
      <Typography variant="body1" sx={{ color: "#34be10", fontSize: '1.2rem' }}>
        Name: {stockInfo.name}
      </Typography>
      <Typography variant="body1" sx={{ color: "#34be10", fontSize: '1.2rem' }}>
        Current Price: ${stockInfo.currentPrice.toFixed(2)}
      </Typography>
      {stockQuantity !== null && (
        <Typography variant="body1" sx={{ color: "#34be10", fontSize: '1.2rem' }}>
          You own {stockQuantity} shares of {stockInfo.ticker}
        </Typography>
      )}
    </Box>
  );
};

export default StockInfoDisplay;
