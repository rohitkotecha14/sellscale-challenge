from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from .db import Base

# User model to store user information
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=False)  # Add first name
    last_name = Column(String, nullable=False)   # Add last name
    password = Column(String, nullable=False)    # Add password for authentication
    wallet_balance = Column(Float, default=0.0)  # Add wallet balance with a default value of 0.0

    # One-to-many relationship with Portfolio
    portfolio = relationship("Portfolio", back_populates="owner", cascade="all, delete")

# Portfolio model to store stock transactions
class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True)  # e.g., AAPL, TSLA
    quantity = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))

    # Relationship with User
    owner = relationship("User", back_populates="portfolio")
