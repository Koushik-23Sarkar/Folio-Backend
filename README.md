# CalmJournal

CalmJournal is a backend application that allows users to write journal entries after immersive nature sessions (forest, ocean, mountain) and analyze their emotions using an LLM.

The system stores journal entries, performs emotion analysis, and generates insights about a user's mental state over time.

---

# Features

* User authentication (JWT)
* Journal entry creation
* Emotion analysis using LLM
* User insights API
* MongoDB database
* Docker-based setup for easy installation

---

# Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Docker
* LLM API (Gemini)

---

# Project Structure

```
CalmJournal/
│
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
```

---

# Prerequisites

Make sure the following tools are installed:

* Docker
* Docker Compose
* Git

---

# Installation

Clone the repository

```
git clone <repository-url>
cd CalmJournal
```

---

# Environment Variables

Create a `.env` file from the example file.

```
cp .env.example .env
```

Then update the values in `.env`.

Example:

```
PORT=8000

MONGODB_URI=mongodb://mongodb:27017/calmjournal

CORS_ORIGIN=http://localhost:3000

ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_secret
REFRESH_TOKEN_EXPIRY=7d

GEMINI_API_KEY=your_gemini_api_key
```

---

# Run the Application (One Command)

Start the entire application using Docker.

```
docker compose up --build
```

This command will:

* Build the Node.js application image
* Start the backend server
* Start a MongoDB database
* Connect the backend to MongoDB automatically

---

# Access the Application

After running the containers:

Backend API:

```
http://localhost:8000
```

MongoDB:

```
mongodb://localhost:27017
```

---

# Stop the Application

To stop the running containers:

```
docker compose down
```

---

# API Endpoints

### Create Journal Entry

```
POST /api/journal
```

Example request:

```
{
  "ambience": "forest",
  "text": "I felt calm today after listening to the rain."
}
```

---

### Analyze Emotion

```
POST /api/journal/analyze
```

Example request:

```
{
  "text": "I felt peaceful and relaxed today."
}
```

---

### Get User Insights

```
GET /api/journal/insights/:userId
```

Example response:

```
{
  "totalEntries": 8,
  "topEmotion": "calm",
  "mostUsedAmbience": "forest",
  "recentKeywords": ["focus", "nature", "rain"]
}
```

---

# Development

If you want to run the project without Docker:

Install dependencies

```
npm install
```

Run the server

```
npm start
```

---

# Author

Koushik Sarkar
B.Tech Information Technology
MAKAUT

---

# License

This project is open-source and available under the MIT License.
