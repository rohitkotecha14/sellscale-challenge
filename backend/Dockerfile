# Use an official Python runtime based on Python 3.12
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
# If you are using Poetry for dependency management:
COPY pyproject.toml poetry.lock* /app/

# Install Poetry
RUN pip install poetry

# Install dependencies using Poetry
RUN poetry install --no-dev --no-interaction --no-ansi

# Copy the rest of the application code into the container
COPY . /app

# Expose port 8000 for FastAPI to run on
EXPOSE 8000

# Command to run the FastAPI app with Uvicorn
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
