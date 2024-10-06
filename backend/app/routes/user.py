from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from sqlalchemy.orm import Session

from app.exceptions.userExceptions import UserAlreadyRegisteredException, InvalidCredentialsException, \
    NotAuthenticatedException, UserNotFoundException, WalletUpdateException, EmailAlreadyRegisteredException
from app.schemas.user import UserCreate, UserLogin
from app.database.db import get_db
from passlib.hash import bcrypt
from app.service.user_service import create_user_service, get_user_by_username_service, delete_user_service, \
    update_wallet_balance_service, get_user_by_email_service

router = APIRouter()

# Route to register a new user
# Route to register a new user
@router.post("/register", response_model=UserCreate)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # Check if username already exists
        db_user = get_user_by_username_service(db, username=user.username)
        if db_user:
            raise UserAlreadyRegisteredException()

        # Check if email already exists
        db_email = get_user_by_email_service(db, email=user.email)
        if db_email:
            raise EmailAlreadyRegisteredException()

        # Hash the password before storing
        hashed_password = bcrypt.hash(user.password)

        # Create and return the new user
        return create_user_service(
            db=db,
            username=user.username,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            password=hashed_password
        )
    except UserAlreadyRegisteredException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username is already registered")
    except EmailAlreadyRegisteredException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is already registered")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error during registration")

# Route to log in and set a cookie
@router.post("/login")
async def login_user(response: Response, user: UserLogin, db: Session = Depends(get_db)):
    try:
        db_user = get_user_by_username_service(db, username=user.username)

        if not db_user or not bcrypt.verify(user.password, db_user.password):
            raise InvalidCredentialsException()

        # Set the HttpOnly cookie with username
        response.set_cookie(
            key="username",
            value=db_user.username,
            max_age=60*5,
            httponly=True,
            samesite="Lax"
        )

        return {"message": "Logged in successfully"}
    except InvalidCredentialsException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error during login")

# Route to log out and clear the cookie
@router.post("/logout")
async def logout_user(response: Response):
    try:
        # Delete the cookie
        response.delete_cookie("username")
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error during logout")

# Route to get current logged-in user
@router.get("/me")
async def get_current_user(request: Request, db: Session = Depends(get_db)):
    try:
        username = request.cookies.get("username")

        if not username:
            raise NotAuthenticatedException()

        db_user = get_user_by_username_service(db, username=username)

        if db_user is None:
            raise UserNotFoundException()

        return db_user
    except NotAuthenticatedException as e:
        raise e
    except UserNotFoundException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving user details")

# Inside app/routes/user_service.py or wherever your user routes are defined

@router.delete("/delete", status_code=204)
async def delete_user(db: Session = Depends(get_db), user=Depends(get_current_user)):
    try:
        delete_user_service(db=db, user_id=user.id)
        return {"message": "User account deleted successfully"}
    except ValueError as e:
        raise UserNotFoundException()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error deleting user account")




# Route to get the current wallet balance of the logged-in user
@router.get("/wallet", response_model=float)
async def get_wallet_balance(user=Depends(get_current_user)):
    try:
        return user.wallet_balance
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving wallet balance")


# Route to update the wallet balance of the logged-in user
@router.put("/wallet")
async def update_wallet_balance(new_balance: float, db: Session = Depends(get_db), user=Depends(get_current_user)):
    try:
        updated_user = update_wallet_balance_service(db, user_id=user.id, new_balance=new_balance)
        return {"message": "Wallet balance updated", "new_balance": updated_user.wallet_balance}
    except ValueError as e:
        raise WalletUpdateException(str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error updating wallet balance")
