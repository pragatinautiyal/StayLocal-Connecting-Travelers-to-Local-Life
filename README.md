# StayLocal – Connecting Travelers to Local Life

StayLocal is an AI-assisted full-stack web application that helps travellers discover authentic local experiences by connecting them with local hosts, businesses, and experiences.

The platform allows local hosts to list homestays, cafés, workshops, restaurants, shopping experiences, wellness activities, and other local attractions, while travellers can explore destinations, save favourites, and generate AI-powered personalized itineraries based on listings available on the StayLocal platform.

---

# Tech Stack

**Frontend**
- React.js
- React Router
- Tailwind CSS

**Backend**
- FastAPI
- Python

**Database**
- MongoDB Atlas

**AI**
- Google Gemini API

---

# Key Features

- 🏡 Discover authentic local stays, businesses, and experiences
- 🤖 AI-powered personalized travel itineraries using Google Gemini
- ❤️ Wishlist to save favourite listings
- 🔐 Secure JWT authentication with role-based access
- 🖼️ Image upload support for hosts
- 📍 Search listings by city
- 📱 Responsive React frontend with Tailwind CSS

---

# Database Choice

StayLocal uses **MongoDB Atlas**, a cloud-based NoSQL database.

### Why MongoDB?

- Flexible document-based schema suitable for listing data.
- Easily stores nested and dynamic data.
- Integrates seamlessly with FastAPI.
- Cloud-hosted with automatic backups and high availability.
- Scalable for future features such as bookings, reviews, and notifications.

---

# Database Schema


![StayLocal Database Schema]
<img width="1241" height="536" alt="Untitled(1)" src="https://github.com/user-attachments/assets/d40c9a50-304a-4d36-abec-605030869a13" />



---

# Database Models

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
- category (Stay, Food & Drink, Experience, Workshop, Shopping, Event, Wellness)
- listingType (Homestay, Café, Restaurant, Pottery Workshop, Trek, etc.)
- city
- state
- address
- price
- priceUnit (Per Night, Per Person, Per Ticket, Average Spend, Starting From)
- images

## Wishlist

- userId (Foreign Key → User._id)
- listingId (Foreign Key → Listing.id)
- createdAt

## AIPlannerRequest

- destination
- budget
- days
- travel_type

---

# Backend Features

- JWT Authentication
- Role-Based Authorization
- Protected Routes
- Secure Password Hashing
- Host Dashboard
- Traveller Dashboard
- CRUD Operations for Listings
- Wishlist Management
- Search Listings by City
- AI Travel Planner powered by Google Gemini
- AI Prompt Engineering using StayLocal Listings
- Image Upload Support
- MongoDB Atlas Integration
- Global Exception Handling
- CORS Configuration
- Interactive Swagger API Documentation

---

# AI Travel Planner

StayLocal integrates Google's Gemini API to generate personalized travel itineraries.

The AI combines traveller preferences with StayLocal listings stored in MongoDB.

Features

- Personalized day-wise itinerary
- Budget-aware recommendations
- Prioritizes StayLocal hosts
- Local food recommendations
- Hidden gems
- Transport suggestions
- Budget summary

---
  
# Wishlist

Travellers can save favourite listings to their personal wishlist for future planning.

Features

- Add listing
- Remove listing
- View saved listings

---

# API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Home Route |
| POST | `/register` | Register User |
| POST | `/login` | Login User |
| POST | `/auth/google` | Google OAuth Login/Register |
| GET | `/api/profile` | Get Current User Profile |
| GET | `/api/dashboard` | Host Dashboard |
| GET | `/api/listings` | Get All Listings |
| GET | `/api/listings/{id}` | Get Single Listing |
| GET | `/api/listings/search` | Search Listings by City |
| GET | `/api/my-listings` | Get Listings Created by Current Host |
| POST | `/api/listings` | Create Listing |
| PUT | `/api/listings/{id}` | Update Listing |
| DELETE | `/api/listings/{id}` | Delete Listing |
| GET | `/api/wishlist` | Get User Wishlist |
| POST | `/api/wishlist/{listing_id}` | Add Listing to Wishlist |
| DELETE | `/api/wishlist/{listing_id}` | Remove Listing from Wishlist |
| POST | `/api/ai-planner` | Generate AI-Powered Travel Itinerary |

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
listings
users
wishlist
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
GEMINI_API_KEY=your_api_key
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
│   ├── services/
│   │   └── ai_service.py
│   ├── uploads/
│   ├── auth.py
│   ├── database.py
│   ├── limiter.py
│   ├── main.py
│   ├── models.py
│   ├── security.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Future Enhancements

- Booking System
- Payment Gateway Integration
- Review & Rating System
- Interactive Maps
- Notifications

---

# License

This project is developed for educational and internship purposes.
