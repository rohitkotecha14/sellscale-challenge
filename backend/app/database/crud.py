from sqlalchemy.orm import Session
from . import models
from app.database.models import User, Portfolio

def create_user(db: Session, username: str, email: str, first_name: str, last_name: str, password: str):
    # Initialize wallet balance to 0.0 when creating a new user
    db_user = User(
        username=username,
        email=email,
        first_name=first_name,
        last_name=last_name,
        password=password,
        wallet_balance=0.0  # Set default wallet balance
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Get all users
def get_all_users(db: Session):
    return db.query(models.User).all()

# Get a user by ID
def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

# Get a user by username
def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise ValueError("User not found")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# Update wallet balance for a user
def update_wallet_balance(db: Session, user_id: int, new_balance: float):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.wallet_balance = new_balance
        db.commit()
        db.refresh(user)
        return user
    else:
        raise ValueError("User not found")

# Buy a stock (add or update portfolio entry)
def buy_stock(db: Session, user_id: int, ticker: str, quantity: int):
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
def sell_stock(db: Session, user_id: int, ticker: str, quantity: int):
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
def get_portfolio(db: Session, user_id: int):
    print(user_id, Portfolio.user_id)
    return db.query(models.Portfolio).filter(models.Portfolio.user_id == user_id).all()
