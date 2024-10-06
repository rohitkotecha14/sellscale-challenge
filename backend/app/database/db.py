from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# PostgreSQL connection URL (Replace with your actual credentials)
SQLALCHEMY_DATABASE_URL = os.getenv('DATABASE_URL')

# Example:
# SQLALCHEMY_DATABASE_URL = "postgresql://myuser:mypassword@myhost.aivencloud.com:5432/mydatabase?sslmode=require"

# Create the PostgreSQL engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a configured "SessionLocal" class for creating sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define the Base class, which will be inherited by all models
Base = declarative_base()

# Dependency for getting the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
