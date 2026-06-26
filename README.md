# StayLocal – Connecting Travelers to Local Life

A platform that helps travelers experience authentic local culture by connecting them with locals and discovering unique homestays and local experiences.

## Tech Stack

**Frontend:** React / Next.js

**Backend:** Python, FastAPI

**Database:** MongoDB Atlas

---

## Backend Features

* REST API built with FastAPI
* CRUD operations for listings
* Search listings by location
* Proper HTTP status codes
* JSON-based API responses
* Global exception handling
* CORS configuration enabled
* Interactive API documentation using Swagger UI

---

## API Endpoints

| Method | Endpoint                         | Description                 |
| ------ | -------------------------------- | --------------------------- |
| GET    | `/`                              | Home route                  |
| GET    | `/api/listings`                  | Get all listings            |
| GET    | `/api/listings/{listing_id}`     | Get a single listing        |
| POST   | `/api/listings`                  | Create a new listing        |
| PUT    | `/api/listings/{listing_id}`     | Update a listing            |
| DELETE | `/api/listings/{listing_id}`     | Delete a listing            |
| GET    | `/api/listings/search?location=` | Search listings by location |

---

## How to Run Backend Locally

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>/Backend
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

### 3. Activate the Virtual Environment

**Windows**

```bash
venv\Scripts\activate
```

**Mac/Linux**

```bash
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Create Environment Variables

Create a `.env` file using `.env.example` as reference.

### 6. Run the Backend Server

```bash
uvicorn main:app --reload --port 5000
```

### 7. Access the API

API Base URL:

```text
http://127.0.0.1:5000
```

Swagger Documentation:

```text
http://127.0.0.1:5000/docs
```

ReDoc Documentation:

```text
http://127.0.0.1:5000/redoc
```

---

## Project Structure

```text
Backend/
├── main.py
├── requirements.txt
├── .env.example
└── README.md
```
