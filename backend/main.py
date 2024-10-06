from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import models, db
from app.routes import stock, portfolio, user

app = FastAPI()

# Create the database tables
models.Base.metadata.create_all(bind=db.engine)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Ensure this matches your frontend's origin
    allow_credentials=True,  # Allow cookies and credentials to be passed
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include API routes
app.include_router(stock.router, prefix="/stock")
app.include_router(portfolio.router, prefix="/portfolio")
app.include_router(user.router, prefix="/user")

@app.get("/")
async def root():
    return {"message": "Welcome to the Robinhood Clone"}
