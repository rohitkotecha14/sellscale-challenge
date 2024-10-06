import os
import requests
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
import yfinance as yf

from app.exceptions.portfolioExceptions import RateLimitExceededException

load_dotenv()

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

router = APIRouter()

# Route for querying stock information
@router.get("/query/{ticker}")
async def query_stock(ticker: str):
    # Use yfinance to fetch the stock data
    stock = yf.Ticker(ticker)

    stock_info = stock.info

    # If no stock info is found, return a 404 error
    if not stock_info or stock_info['trailingPegRatio'] is None:
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

# New route for fetching stock chart data
@router.get("/chart/{ticker}")
async def get_stock_chart(ticker: str, period: str = "1mo", interval: str = "1d"):
    try:
        # Fetch stock data from yfinance
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period, interval=interval)

        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No historical data found for {ticker}")

        # Prepare the chart data (dates and closing prices)
        chart_data = {
            "dates": hist.index.strftime('%Y-%m-%d').tolist(),
            "prices": hist["Close"].tolist()
        }

        return chart_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chart data: {str(e)}")

@router.get("/search/{company_name}")
def search_company(company_name: str):
    url = f"https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={company_name}&apikey={ALPHA_VANTAGE_API_KEY}"
    response = requests.get(url)
    data = response.json()

    # Check if the response contains a rate limit message
    if 'Information' in data and 'API rate limit' in data['Information']:
        raise RateLimitExceededException(detail=data['Information'])

    # Check if 'bestMatches' exists in the response
    if 'bestMatches' in data:
        matches = data['bestMatches']
        return {"matches": matches}

    # If no matches found, return an error response
    return {"error": "No company found"}