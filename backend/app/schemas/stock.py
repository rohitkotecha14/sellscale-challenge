from pydantic import BaseModel

# Schema for buying or selling stock
class StockTransaction(BaseModel):
    ticker: str
    quantity: int

    class Config:
        orm_mode = True

# Schema for viewing a stock entry in the portfolio
class PortfolioEntry(BaseModel):
    id: int
    ticker: str
    quantity: int

    class Config:
        orm_mode = True

# Schema for viewing a user's full portfolio
class Portfolio(BaseModel):
    portfolio: list[PortfolioEntry]

    class Config:
        orm_mode = True
