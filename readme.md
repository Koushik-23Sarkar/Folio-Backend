# Folio Backend

Folio is a backend application that allows users to write journal
entries after immersive nature sessions (forest, ocean, mountain) and
analyze their emotions using an LLM.

The system stores journal entries, performs emotion analysis, and
generates insights about a user's mental state over time.

------------------------------------------------------------------------

# Features

-   User authentication using JWT
-   Journal entry creation
-   Emotion analysis using LLM
-   User insights API
-   MongoDB database
-   Docker-based setup for easy installation

------------------------------------------------------------------------

# Tech Stack

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   Docker
-   LLM API (Gemini)

------------------------------------------------------------------------

# Project Structure

    Folio-Backend
    │
    ├── docker-compose.yml
    ├── Dockerfile
    ├── package.json
    ├── package-lock.json
    ├── README.md
    │
    └── src
        ├── app.js
        ├── constants.js
        ├── index.js
        │
        ├── controllers
        │   ├── journal.controller.js
        │   └── user.controller.js
        │
        ├── db
        │   └── index.js
        │
        ├── middlewares
        │   └── auth.middleware.js
        │
        ├── models
        │   ├── EmotionAnalysis.model.js
        │   ├── journal.model.js
        │   └── user.model.js
        │
        ├── routes
        │   ├── journal.routes.js
        │   └── user.routes.js
        │
        ├── services
        │   └── llm.service.js
        │
        └── utils
            ├── ApiError.js
            ├── ApiResponse.js
            └── AsyncHandler.js

------------------------------------------------------------------------

# Prerequisites

Make sure the following tools are installed:

-   Docker
-   Docker Compose
-   Git
-   Node.js (only required if running without Docker)

------------------------------------------------------------------------

# Installation

Clone the repository

    git clone <repository-url>
    cd Folio-Backend

------------------------------------------------------------------------

# Environment Variables

Create a `.env` file from the example file.

    cp .env.example .env

Then update the values in `.env`.

Example:

    PORT=8000

    # Database Configuration
    # Use your MongoDB Atlas connection string or local instance
    MONGODB_URI=mongodb://mongodb:27017

    # Security & CORS
    # The URL of your frontend application
    CORS_ORIGIN=http://localhost:3000

    # Authentication (JWT)
    # Generate strong secrets (example: openssl rand -base64 32)
    ACCESS_TOKEN_SECRET=<your_access_token_secret>
    ACCESS_TOKEN_EXPIRY=1d

    REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
    REFRESH_TOKEN_EXPIRY=7d

    # Google Gemini AI
    # API key used for emotion analysis
    GEMINI_API_KEY=<your_gemini_api_key>

------------------------------------------------------------------------

# Running the Application

You can run the application in two ways.

------------------------------------------------------------------------

# Option A --- Use MongoDB Atlas

If you already have a MongoDB Atlas database, you can run only the
backend container.

Make sure your `.env` file contains your Atlas connection string.

Example:

    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/folio

Run the application:

    npm run docker:build
    npm run docker:run

These commands will:

-   Build the Node.js Docker image
-   Start the backend container
-   Connect to MongoDB Atlas automatically

------------------------------------------------------------------------

# Option B --- Use MongoDB with Docker Compose

If you want to run MongoDB locally using Docker.

Update `.env`:

    MONGODB_URI=mongodb://mongodb:27017

Run:

    npm run docker:compose

This will:

-   Build the backend Docker image
-   Start the backend server
-   Start a MongoDB container
-   Automatically connect the backend to MongoDB

------------------------------------------------------------------------

# Access the Application

After starting the containers:

Backend API:

    http://localhost:8000

------------------------------------------------------------------------

# Stop the Application

To stop and remove containers:

    docker compose down

------------------------------------------------------------------------

# Important API Endpoints

## Create Journal Entry

    POST /api/journal

Example Request

    {
      "ambience": "forest",
      "text": "I felt calm today after listening to the rain."
    }

------------------------------------------------------------------------

## Analyze Emotion

    POST /api/journal/analyze

Example Request

    {
      "text": "I felt peaceful and relaxed today.",
      "journalId": "<journalId>"
    }

------------------------------------------------------------------------

## Get User Insights

    GET /api/journal/insights/:userId

Example Response

    {
      "totalEntries": 8,
      "topEmotion": "calm",
      "mostUsedAmbience": "forest",
      "recentKeywords": ["focus", "nature", "rain"]
    }

------------------------------------------------------------------------

# Development (Without Docker)

Install dependencies

    npm install

Run the development server

    npm run dev

------------------------------------------------------------------------

# Author

**Koushik Sarkar**\
B.Tech in Information Technology\
MAKAUT