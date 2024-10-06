import React from 'react';
import { Box, TextField, Typography } from "@mui/material";
import StyledButton from "./StyledButton";

interface BuySellSectionProps {
  ticker: string;
  quantity: number;
  setQuantity: (value: number) => void;
  handleBuy: () => void;
  handleSell: () => void;
  loading: boolean;
  portfolioMessage: string;
}

const BuySellSection: React.FC<BuySellSectionProps> = ({
  ticker,
  quantity,
  setQuantity,
  handleBuy,
  handleSell,
  loading,
  portfolioMessage
}) => {

  return (
    <>
      <TextField
        fullWidth
        label="Enter Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        sx={{
          marginTop: 2,
          marginBottom: 2,
          backgroundColor: "#0d2d13",
          borderRadius: 2,
          "& .MuiInputBase-input": { color: "#34be10" },
          "& .MuiInputLabel-root": { color: "#34be10" },
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <StyledButton
          onClick={handleBuy}
          disabled={loading || !ticker || quantity <= 0}
          loading={loading}
          customColor="#38c804"
          fullWidth={false}
          sx={{ flexGrow: 1, marginRight: 1 }}
        >
          Buy Stock
        </StyledButton>

        <StyledButton
          onClick={handleSell}
          disabled={loading || !ticker || quantity <= 0}
          loading={loading}
          customColor="#f44336"
          fullWidth={false}
          sx={{ flexGrow: 1, marginLeft: 1 }}
        >
          Sell Stock
        </StyledButton>
      </Box>

      {portfolioMessage && (
        <Typography variant="body1" sx={{ marginTop: 2, color: "#38c804" }}>
          {portfolioMessage}
        </Typography>
      )}
    </>
  );
};

export default BuySellSection;
