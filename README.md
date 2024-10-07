# SellScale Challenge

## Overview

This project consists of two main components:
1. **Backend**: A FastAPI application built with Python 3.12.
2. **Frontend**: A React application using Node.js (version 16).

Both services can be run using **Docker** with the provided `docker-compose.yml` file for a smooth development and deployment experience. If Docker is not available, there are instructions below on how to run the services separately using Python's virtual environment for the backend and Node.js for the frontend.

## Prerequisites

### Docker
- Ensure that you have **Docker** and **Docker Compose** installed. If you don't, you can download it from [here](https://www.docker.com/get-started).

### Python 3.12 preferred (If not using Docker)
- You need **Python 3.12** installed on your system to run the backend. You can download it from [here](https://www.python.org/downloads/release/python-3120/).

### Node.js (If not using Docker)
- The frontend requires **Node.js version 16** and **npm**. You can download it from [here](https://nodejs.org/en/download).

## Running the Application with Docker

To run both the backend and frontend services using Docker, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/rohitkotecha14/sellscale-challenge/tree/main
    cd sellscale-challenge
    ```

2. Ensure Docker is running on your system.

3. Run the services:

    ```bash
    docker-compose up --build
    ```

4. Both the backend and frontend will now be running:

   - **Backend (FastAPI)** will be available at: `http://localhost:8000`
   - **Frontend (React)** will be available at: `http://localhost:3000`

## Running the Backend without Docker

If Docker is not an option and you wish to run the backend manually:

1. Ensure you have **Python 3.12** installed.

2. Navigate to the backend directory:

    ```bash
    cd backend
    ```

3. Create and activate a virtual environment:

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
    ```

4. Install the required dependencies:

    ```bash
    pip install -r requirements.txt
    ```

5. Run the FastAPI application with **Uvicorn**:

    ```bash
    uvicorn main:app --reload
    ```

6. The backend will now be running on `http://localhost:8000`.

## Running the Frontend without Docker

If Docker is not an option and you wish to run the frontend manually:

1. Ensure you have **Node.js version 16** and **npm** installed.

2. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

3. Install the required dependencies:

    ```bash
    npm install
    ```

4. Run the React application:

    ```bash
    npm start
    ```

5. The frontend will now be running on `http://localhost:3000`.

## Notes

- **Docker**: This is the preferred method for running both services as it eliminates the need for manual setup of environments and dependencies.
- **Backend API Documentation**: You can access the automatically generated API documentation provided by FastAPI at `http://localhost:8000/docs` when the backend is running.
- **Frontend Development**: When running the frontend separately, it is recommended to use **npm start** for development purposes to enable hot-reloading and faster development experience.
