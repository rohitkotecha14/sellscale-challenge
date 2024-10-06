from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin
from app.database.db import get_db
from passlib.hash import bcrypt
from app.service.user_service import create_user_service, get_user_by_username_service, delete_user_service, update_wallet_balance_service

router = APIRouter()

# Route to register a new user
@router.post("/register", response_model=UserCreate)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_username_service(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    # Hash the password before storing
    hashed_password = bcrypt.hash(user.password)
    return create_user_service(
        db=db,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        password=hashed_password
    )

# Route to log in and set a cookie
@router.post("/login")
async def login_user(response: Response, user: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user_by_username_service(db, username=user.username)

    if not db_user or not bcrypt.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    # Set the HttpOnly cookie with username (you can also add 'Secure' if running on HTTPS)
    response.set_cookie(
        key="username",
        value=db_user.username,
        max_age=60*5,
        httponly=True,
        samesite="Lax"
    )

    return {"message": "Logged in successfully"}

# Route to log out and clear the cookie
@router.post("/logout")
async def logout_user(response: Response):
    # Delete the cookie
    response.delete_cookie("username")
    return {"message": "Logged out"}

# Route to get current logged-in user
@router.get("/me")
async def get_current_user(request: Request, db: Session = Depends(get_db)):
    username = request.cookies.get("username")

    if not username:
        raise HTTPException(status_code=401, detail="Not authenticated")

    db_user = get_user_by_username_service(db, username=username)

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return db_user

# Inside app/routes/user_service.py or wherever your user routes are defined

@router.delete("/delete", status_code=204)
async def delete_user(db: Session = Depends(get_db), user=Depends(get_current_user)):
    try:
        delete_user_service(db=db, user_id=user.id)
        return {"message": "User account deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# Route to get the current wallet balance of the logged-in user
@router.get("/wallet", response_model=float)
async def get_wallet_balance(user=Depends(get_current_user)):
    return user.wallet_balance


# Route to update the wallet balance of the logged-in user
@router.put("/wallet")
async def update_wallet_balance(new_balance: float, db: Session = Depends(get_db), user=Depends(get_current_user)):
    try:
        updated_user = update_wallet_balance_service(db, user_id=user.id, new_balance=new_balance)
        return {"message": "Wallet balance updated", "new_balance": updated_user.wallet_balance}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
