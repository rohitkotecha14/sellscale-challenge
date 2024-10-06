from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session
from app.service.portfolio_service import get_portfolio_service, buy_stock_service, sell_stock_service
from app.service.user_service import get_user_by_username_service
from app.schemas.stock import StockTransaction, Portfolio
from app.database.db import get_db

router = APIRouter()


# Helper function to get the current user from the cookie
async def get_current_user(request: Request, db: Session = Depends(get_db)):
    username = request.cookies.get("username")
    if not username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    user = get_user_by_username_service(db, username=username)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user


# Route to view the current user's portfolio
@router.get("/view", response_model=Portfolio)
async def view_portfolio(db: Session = Depends(get_db), user=Depends(get_current_user)):
    portfolio_entries = get_portfolio_service(db, user_id=user.id)

    # Wrap the portfolio entries in the Portfolio schema
    return {"portfolio": portfolio_entries}


# Route to buy stock
@router.post("/buy", response_model=StockTransaction)
async def buy_stock(transaction: StockTransaction, db: Session = Depends(get_db), user=Depends(get_current_user)):
    stock = buy_stock_service(db, user_id=user.id, ticker=transaction.ticker, quantity=transaction.quantity)
    return stock


# Route to sell stock
@router.post("/sell", response_model=StockTransaction)
async def sell_stock(transaction: StockTransaction, db: Session = Depends(get_db), user=Depends(get_current_user)):
    stock = sell_stock_service(db, user_id=user.id, ticker=transaction.ticker, quantity=transaction.quantity)
    return stock
