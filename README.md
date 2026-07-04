# StayLocal – Connecting Travelers to Local Life

StayLocal is an AI-assisted full-stack web application that helps travelers discover authentic local experiences by connecting them with local hosts offering homestays and unique stays. The platform provides secure role-based access for Hosts and Travellers, allowing hosts to manage listings while travelers can explore destinations and receive AI-powered travel recommendations.

---

# Tech Stack

**Frontend**
- React.js
- React Router
- Tailwind CSS

**Backend**
- Python
- FastAPI

**Database**
- MongoDB Atlas

---

# Database Choice

StayLocal uses **MongoDB Atlas**, a cloud-based NoSQL database.

### Why MongoDB?

- Flexible document-based schema suitable for listing data.
- Easily stores nested and dynamic data.
- Integrates seamlessly with FastAPI.
- Cloud-hosted with automatic backups and high availability.
- Scalable for future features such as bookings, reviews, wishlists, and AI recommendations.

---

# Database Schema

> Replace the image path below with your exported schema diagram.

![StayLocal Database Schema]
<img width="719" height="538" alt="Screenshot 2026-07-04 192442" src="https://github.com/user-attachments/assets/50af37c4-0cb4-47a5-801b-bdf7681ce426" />



---

# Current Database Entities

## User

- _id (Primary Key)
- fullName
- email
- password
- role (Host / Traveller)
- phone
- profileImage
- isVerified
- verificationStatus

## Listing

- id (Primary Key)
- hostId (Foreign Key → User._id)
- title
- description
- location
- price
- category
- season
- image

---

# Backend Features

- JWT Authentication
- Role-Based Authorization
- Protected Routes
- Host Dashboard
- Traveller Dashboard
- CRUD Operations for Listings
- AI Travel Planner
- Search Listings by Location
- Image Upload Support
- MongoDB Atlas Integration
- Global Exception Handling
- CORS Configuration
- Interactive Swagger API Documentation

---

# API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Home Route |
| POST | `/register` | Register User |
| POST | `/login` | Login User |
| GET | `/api/profile` | Get Current User |
| GET | `/api/listings` | Get All Listings |
| GET | `/api/my-listings` | Get Host Listings |
| GET | `/api/listings/{id}` | Get Single Listing |
| GET | `/api/listings/search` | Search Listings |
| POST | `/api/listings` | Create Listing |
| PUT | `/api/listings/{id}` | Update Listing |
| DELETE | `/api/listings/{id}` | Delete Listing |
| GET | `/api/dashboard` | Host Dashboard |
| POST | `/api/ai-planner` | AI Travel Planner |

---

# Database Setup

## 1. Create a MongoDB Atlas Account

Create a free MongoDB Atlas cluster.

## 2. Create a Database

Database Name

```
staylocal
```

Collections

```
users
listings
```

## 3. Obtain the Connection String

From MongoDB Atlas, copy your connection string.

Example:

```text
mongodb+srv://<username>:<password>@cluster.mongodb.net/
```

## 4. Configure Environment Variables

Create a `.env` file in the backend directory.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
```

## 5. Install Dependencies

```bash
pip install -r requirements.txt
```

## 6. Start the Backend

```bash
uvicorn test_app:app --reload
```

The API will run at

```
http://127.0.0.1:8000
```

---

# Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# Project Structure

```text
StayLocal/
│
├── backend/
│   ├── auth.py
│   ├── security.py
│   ├── database.py
│   ├── models.py
│   ├── test_app.py
│   ├── uploads/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│
└── README.md
```

---

# Future Enhancements

- Booking System
- Wishlist
- Payment Gateway Integration
- Review & Rating System
- AI-based Personalized Recommendations
- Host Verification
- Interactive Maps
- Notifications
