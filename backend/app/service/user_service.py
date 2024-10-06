from sqlalchemy.orm import Session
from app.database.models import User


def create_user_service(db: Session, username: str, email: str, first_name: str, last_name: str, password: str):
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


def get_user_by_email_service(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# Get all users
def get_all_users_service(db: Session):
    return db.query(User).all()

# Get a user by ID
def get_user_by_id_service(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

# Get a user by username
def get_user_by_username_service(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def delete_user_service(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise ValueError("User not found")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# Update wallet balance for a user
def update_wallet_balance_service(db: Session, user_id: int, new_balance: float):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.wallet_balance = new_balance
        db.commit()
        db.refresh(user)
        return user
    else:
        raise ValueError("User not found")