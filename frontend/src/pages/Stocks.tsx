import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { queryStock, searchCompany } from "../services/stock";
import { buyStock, sellStock, viewPortfolio } from "../services/portfolio";
import StyledButton from "../components/StyledButton";
import StockInfoDisplay from "../components/StockInfo";
import BuySellSection from "../components/BuySell";
import CompanySearch from "../components/CompanySearch";
import StockChart from "../components/StockChart";

const Stocks = () => {
  const [ticker, setTicker] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [companyMatches, setCompanyMatches] = useState<any[]>([]);
  const [stockInfo, setStockInfo] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [portfolioMessage, setPortfolioMessage] = useState(""); 
  const [portfolio, setPortfolio] = useState<any[]>([]); 
  const [stockQuantity, setStockQuantity] = useState<number | null>(null); 
  const [searchLimitReached, setSearchLimitReached] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const portfolioData = await viewPortfolio();
        setPortfolio(portfolioData.portfolio || portfolioData);
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
      }
    };
    fetchPortfolio();
  }, []);

  const handleSearch = async () => {
    if (searchLimitReached) {
      // Search by ticker if search limit reached
      handleTickerQuery();
    } else {
      // Search by company otherwise
      handleCompanySearch();
    }
  };

  const handleCompanySearch = async () => {
    setLoading(true);
    setError("");
    setCompanyMatches([]);
  
    try {
      const data = await searchCompany(searchTerm);
      if (data && Array.isArray(data)) {
        const matches = data.map((match: any) => ({
          symbol: match['1. symbol'],
          name: match['2. name'],
        }));
        setCompanyMatches(matches);
      } else {
        setError("No companies found.");
      }
    } catch (err: any) {
      if (err.message) { // Assuming 429 means rate limit reached
        setSearchLimitReached(true);  // Switch to stock ticker search mode
      } else {
        setError("Failed to search for companies. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleTickerQuery = async () => {
    setLoading(true);
    setError("");
    setStockInfo(null);

    try {
      const data = await queryStock(searchTerm);  // Use searchTerm as the ticker
      const currentPrice = isNaN(data.current_price)
        ? isNaN(data.previous_close)
          ? 0
          : data.previous_close
        : data.current_price;

      setStockInfo({ ...data, currentPrice });
      const stockInPortfolio = portfolio.find((stock) => stock.ticker === searchTerm);
      if (stockInPortfolio) {
        setStockQuantity(stockInPortfolio.quantity);
      } else {
        setStockQuantity(0);
      }
    } catch (err) {
      setError("Enter valid stock ticker!");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    setLoading(true);
    setPortfolioMessage("");

    try {
      await buyStock(ticker, quantity);
      setPortfolioMessage(`Successfully bought ${quantity} shares of ${ticker}`);
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
      await sellStock(ticker, quantity);
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
        padding: 3, // Adjust padding to give more space
        background: "linear-gradient(135deg, #0d2e16 0%, #176032 100%)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,  // Increased max width to 1200px to fit the content better
          padding: 4,
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: 2,
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)", 
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ color: "#34be10", fontWeight: "bold" }}
        >
          Stock Trading Dashboard
        </Typography>

        {/* Search Company Section */}
        <CompanySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          companyMatches={companyMatches}
          setTicker={setTicker}
          loading={loading}
          handleSearch={handleSearch}
          searchLimitReached={searchLimitReached}  // Indicate if company search limit is reached
        />


        {error && (
          <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}

        {stockInfo && (
          <>
            {/* Flexbox to make stock info and chart appear side by side */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginTop: 3
              }}
            >
              {/* Stock Information */}
              <Box sx={{ width: '45%' }}>
                <StockInfoDisplay stockInfo={stockInfo} stockQuantity={stockQuantity} />
              </Box>

              {/* Stock Chart */}
              <Box sx={{ width: '50%' }}>
                <StockChart ticker={stockInfo.ticker} />
              </Box>
            </Box>
            
            {/* Buy/Sell Section */}
            <BuySellSection
              ticker={ticker}
              quantity={quantity}
              setQuantity={setQuantity}
              handleBuy={handleBuy}
              handleSell={handleSell}
              loading={loading}
              portfolioMessage={portfolioMessage}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Stocks;
