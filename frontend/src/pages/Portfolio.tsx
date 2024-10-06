import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { viewPortfolio } from '../services/portfolio';  // API to fetch portfolio
import { queryStock } from '../services/stock';  // API to fetch current stock prices

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<any[]>([]);  // Store the user's portfolio stocks
  const [portfolioValue, setPortfolioValue] = useState<number>(0);  // Total portfolio value
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the portfolio on component mount
  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError('');

      try {
        const portfolioResponse = await viewPortfolio();  // Fetch portfolio from the backend
        
        // Check if the portfolioResponse has the 'portfolio' key or is directly the list
        const portfolioData = portfolioResponse.portfolio || portfolioResponse;  
        
        // Fetch current prices for all stocks in parallel
        const portfolioWithPrices = await Promise.all(
          portfolioData.map(async (stock: any) => {
            try {
              const stockData = await queryStock(stock.ticker);  // Fetch stock data
              
              // Try to use current price, fallback to last close price if necessary
              const currentPrice = isNaN(stockData.current_price)
                ? (isNaN(stockData.previous_close) ? 0 : stockData.previous_close)
                : stockData.current_price;

              const value = stock.quantity * currentPrice;  // Calculate value of the stock
              return { ...stock, currentPrice, value };  // Return updated stock entry
            } catch (err) {
              return { ...stock, currentPrice: 0, value: 0 };  // Handle failure to fetch stock price
            }
          })
        );

        // Calculate total portfolio value
        const totalValue = portfolioWithPrices.reduce((acc, stock) => acc + stock.value, 0);

        setPortfolio(portfolioWithPrices);  // Set portfolio with current prices
        setPortfolioValue(totalValue);  // Set total portfolio value
      } catch (err) {
        setError('Failed to fetch portfolio data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  // Loading screen with gradient background and CircularProgress
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0d2e16 0%, #176032 100%)', // Same gradient
        }}
      >
        <CircularProgress sx={{ color: '#34be10' }} /> {/* Green spinner */}
        <Typography sx={{ marginLeft: 2, color: '#ffffff' }}>Loading Portfolio...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        background: 'linear-gradient(135deg, #0d2e16 0%, #176032 100%)',  // Dark-to-light green gradient
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 900,
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
          sx={{ textAlign: 'center', fontWeight: 'bold', color: '#34be10' }}  // White text for contrast
        >
          Portfolio
        </Typography>

        <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#34be10' }}>Stock Ticker</TableCell>
                <TableCell align="right" sx={{ color: '#34be10' }}>Quantity</TableCell>
                <TableCell align="right" sx={{ color: '#34be10' }}>Current Price</TableCell>
                <TableCell align="right" sx={{ color: '#34be10' }}>Total Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolio.map((stock) => (
                <TableRow key={stock.ticker}>
                  <TableCell sx={{ color: '#34be10' }}>{stock.ticker}</TableCell>
                  <TableCell align="right" sx={{ color: '#34be10' }}>{stock.quantity}</TableCell>
                  <TableCell align="right" sx={{ color: '#34be10' }}>${stock.currentPrice.toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ color: '#34be10' }}>${stock.value.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="h6"
          gutterBottom
          sx={{ marginTop: 2, textAlign: 'center', color: '#34be10' }}
        >
          Total Portfolio Value: ${portfolioValue.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default Portfolio;
