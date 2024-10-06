from fastapi import APIRouter, HTTPException
import yfinance as yf

router = APIRouter()

# Route for querying stock information
@router.get("/query/{ticker}")
async def query_stock(ticker: str):
    # Use yfinance to fetch the stock data
    stock = yf.Ticker(ticker)

    stock_info = stock.info

    # If no stock info is found, return a 404 error
    if not stock_info:
        raise HTTPException(status_code=404, detail=f"Stock {ticker} not found")

    # Return key details from the stock information
    return {
        "ticker": ticker,
        "name": stock_info.get("longName", "N/A"),
        "current_price": stock_info.get("regularMarketPrice", "N/A"),
        "market_cap": stock_info.get("marketCap", "N/A"),
        "previous_close": stock_info.get("previousClose", "N/A"),
        "open_price": stock_info.get("open", "N/A"),
        "day_high": stock_info.get("dayHigh", "N/A"),
        "day_low": stock_info.get("dayLow", "N/A"),
        "52_week_high": stock_info.get("fiftyTwoWeekHigh", "N/A"),
        "52_week_low": stock_info.get("fiftyTwoWeekLow", "N/A")
    }
