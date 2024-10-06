from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    password: str  # Add password field

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: int
    username: str
    email: str
    first_name: str
    last_name: str

    class Config:
        orm_mode = True
