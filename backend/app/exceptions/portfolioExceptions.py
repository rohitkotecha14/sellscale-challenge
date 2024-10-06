from fastapi import HTTPException, status


class StockTransactionException(HTTPException):
    def __init__(self, message: str):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=message)

class RateLimitExceededException(HTTPException):
    def __init__(self, detail: str = "API rate limit exceeded"):
        super().__init__(status_code=429, detail=detail)
