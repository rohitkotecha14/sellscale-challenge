from pydantic import BaseModel

# Schema for creating a new user
class UserCreate(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    password: str  # Add password field

# Schema for user login
class UserLogin(BaseModel):
    username: str
    password: str

# Schema for viewing user information
class User(BaseModel):
    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    wallet_balance: float  # Include wallet balance in the response

    class Config:
        orm_mode = True
