from sqlalchemy.orm import Session
from ..database import models
from app.database.models import User, Portfolio


# Buy a stock (add or update portfolio entry)
def buy_stock_service(db: Session, user_id: int, ticker: str, quantity: int):
    # Check if the stock already exists in the portfolio
    stock = db.query(models.Portfolio).filter(models.Portfolio.user_id == user_id, models.Portfolio.ticker == ticker).first()

    if stock:
        # If stock exists, update the quantity
        stock.quantity += quantity
    else:
        # If stock does not exist, create a new portfolio entry
        stock = models.Portfolio(ticker=ticker, quantity=quantity, user_id=user_id)
        db.add(stock)

    db.commit()
    db.refresh(stock)
    return stock

# Sell a stock (update or remove portfolio entry)
def sell_stock_service(db: Session, user_id: int, ticker: str, quantity: int):
    stock = db.query(models.Portfolio).filter(models.Portfolio.user_id == user_id, models.Portfolio.ticker == ticker).first()

    if stock:
        if stock.quantity >= quantity:
            # If the user owns enough stocks, reduce the quantity
            stock.quantity -= quantity

            if stock.quantity == 0:
                # If the stock quantity is zero, remove it from the portfolio
                db.delete(stock)

            db.commit()
            return stock
        else:
            raise ValueError(f"Insufficient stock quantity to sell: {quantity} > {stock.quantity}")
    else:
        raise ValueError(f"Stock {ticker} not found in the portfolio")

# Get the user's portfolio
def get_portfolio_service(db: Session, user_id: int):
    print(user_id, Portfolio.user_id)
    return db.query(models.Portfolio).filter(models.Portfolio.user_id == user_id).all()
