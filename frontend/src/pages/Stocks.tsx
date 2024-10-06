import React, { useState } from "react";
import {
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { queryStock } from "../services/stock";
import { buyStock, sellStock } from "../services/portfolio";
import StyledButton from "../components/StyledButton";

const Stocks = () => {
  const [ticker, setTicker] = useState("");
  const [stockInfo, setStockInfo] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [portfolioMessage, setPortfolioMessage] = useState(""); // For success or error messages when buying/selling

  const handleQuery = async () => {
    setLoading(true);
    setError("");
    setStockInfo(null);

    try {
      const data = await queryStock(ticker);
      const currentPrice = isNaN(data.current_price)
        ? isNaN(data.previous_close)
          ? 0
          : data.previous_close
        : data.current_price;

      setStockInfo({ ...data, currentPrice });
    } catch (err) {
      setError("Failed to fetch stock information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    setLoading(true);
    setPortfolioMessage("");

    try {
      const data = await buyStock(ticker, quantity);
      setPortfolioMessage(
        `Successfully bought ${quantity} shares of ${ticker}`
      );
    } catch (err) {
      setPortfolioMessage("Failed to buy stock. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    setLoading(true);
    setPortfolioMessage("");

    try {
      const data = await sellStock(ticker, quantity);
      setPortfolioMessage(`Successfully sold ${quantity} shares of ${ticker}`);
    } catch (err) {
      setPortfolioMessage("Failed to sell stock. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #0d2e16 0%, #176032 100%)", // Same gradient as portfolio page
      }}
    >
      <Box
        sx={{
          maxWidth: 800,
          width: "100%",
          padding: 4,
          background: "rgba(255, 255, 255, 0.1)", // Transparent background
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)", // Glass effect shadow
          backdropFilter: "blur(10px)", // Glass effect blur
          border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle border
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#34be10", fontWeight: "bold" }} // Same color as the portfolio page
        >
          Trade Stocks
        </Typography>

        {/* Input for querying stock information */}
        <TextField
          fullWidth
          label="Enter Stock Ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          sx={{
            marginBottom: 2,
            backgroundColor: "#0d2d13", // Darker background for inputs
            borderRadius: 2,
            "& .MuiInputBase-input": { color: "#34be10" }, // White text
            "& .MuiInputLabel-root": { color: "#34be10" }, // White label
          }}
        />
        <StyledButton
          onClick={handleQuery}
          disabled={loading || !ticker}
          loading={loading}
          fullWidth
        >
          Get Stock Information
        </StyledButton>

        {error && (
          <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}

        {stockInfo && (
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: "#34be10" }}>
              Stock Information for {stockInfo.ticker}
            </Typography>
            <Typography variant="body1" sx={{ color: "#34be10" }}>
              Name: {stockInfo.name}
            </Typography>
            <Typography variant="body1" sx={{ color: "#34be10" }}>
              Current Price: ${stockInfo.currentPrice.toFixed(2)}
            </Typography>
          </Box>
        )}

        <TextField
          fullWidth
          label="Enter Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          sx={{
            marginTop: 2,
            marginBottom: 2,
            backgroundColor: "#0d2d13", // Darker background for inputs
            borderRadius: 2,
            "& .MuiInputBase-input": { color: "#34be10" }, // White text
            "& .MuiInputLabel-root": { color: "#34be10" }, // White label
          }}
        />

        {/* Buy and Sell Buttons Side by Side */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <StyledButton
            onClick={handleBuy}
            disabled={loading || !ticker || quantity <= 0}
            loading={loading}
            customColor="#38c804"
            fullWidth={false} // Remove fullWidth to allow them to be side by side
            sx={{ flexGrow: 1, marginRight: 1 }} // Added margin for spacing
          >
            Buy Stock
          </StyledButton>

          <StyledButton
            onClick={handleSell}
            disabled={loading || !ticker || quantity <= 0}
            loading={loading}
            customColor="#f44336"
            fullWidth={false} // Remove fullWidth to allow them to be side by side
            sx={{ flexGrow: 1, marginLeft: 1 }} // Added margin for spacing
          >
            Sell Stock
          </StyledButton>
        </Box>

        {portfolioMessage && (
          <Typography variant="body1" sx={{ marginTop: 2, color: "#38c804" }}>
            {portfolioMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Stocks;
