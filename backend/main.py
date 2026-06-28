from fastapi import FastAPI, HTTPException, status, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

import os
import shutil

import time

app = FastAPI()

UPLOAD_DIR = "uploads"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

class Listing(BaseModel):
    id: int
    title: str
    description: str
    location: str
    price: int
    category: str
    season: str
    image: str

class PlannerRequest(BaseModel):
    budget: int
    season: str
    travel_type: str

class Recommendation(BaseModel):
    title: str
    location: str
    description: str
    price: int
    score: int
    image: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

listings = [
    {
        "id": 1,
        "title": "Village Life Homestay",
        "description": "Peaceful balcony stay surrounded by rural fields.",
        "location": "Uttarakhand",
        "price": 800,
        "category": "cultural",
        "season": "winter",
        "image": "http://127.0.0.1:8000/uploads/village.jpg"
    },
    {
        "id": 2,
        "title": "Mountain View Homestay",
        "description": "Luxury balcony room overlooking mountains.",
        "location": "Mussoorie",
        "price": 1200,
        "category": "adventure",
        "season": "summer",
        "image": "http://127.0.0.1:8000/uploads/mountain.jpg"
    },
    {
        "id": 3,
        "title": "Forest Retreat",
        "description": "Lush green forest view in a cozy bed.",
        "location": "Himachal Pradesh",
        "price": 2200,
        "category": "nature",
        "season": "monsoon",
        "image": "http://127.0.0.1:8000/uploads/forest.jpeg"
    }
]

@app.get("/", status_code=status.HTTP_200_OK)
def home():
    return {
        "message": "Stay Local Backend Running"
    }

@app.get("/api/listings")
def get_listings():
    time.sleep(2)
    return listings

@app.get("/api/listings/search", status_code=status.HTTP_200_OK)
def search_listings(location: str):

    result = [
        listing
        for listing in listings
        if location.lower() in listing["location"].lower()
    ]

    if not result:
        raise HTTPException(
            status_code=404,
            detail="No listings found for this location"
        )

    return result

@app.get("/api/listings/{listing_id}", status_code=status.HTTP_200_OK)
def get_listing(listing_id: int):
    for listing in listings:
        if listing["id"] == listing_id:
            return listing

    raise HTTPException(
        status_code=404,
        detail="Listing not found"
    )

@app.post("/api/listings", status_code=status.HTTP_201_CREATED)
async def create_listing(
    id: int = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    price: int = Form(...),
    category: str = Form(...),
    season: str = Form(...),
    image: UploadFile = File(...)
):

    for existing in listings:
        if existing["id"] == id:
            raise HTTPException(
                status_code=400,
                detail="Listing ID already exists"
            )

    filename = f"{id}_{image.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    image_url = f"http://127.0.0.1:8000/uploads/{filename}"

    listing = {
    "id": id,
    "title": title,
    "description": description,
    "location": location,
    "price": price,
    "category": category,
    "season": season,
    "image": image_url
    }

    listings.append(listing)

    return {
        "message": "Listing created successfully",
        "listing": listing
    }

@app.put(
    "/api/listings/{listing_id}",
    status_code=status.HTTP_200_OK
)
async def update_listing(
    listing_id: int,
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    price: int = Form(...),
    category: str = Form(...),
    season: str = Form(...),
    image: UploadFile = File(None)
):

    for listing in listings:

        if listing["id"] == listing_id:

            listing["title"] = title
            listing["description"] = description
            listing["location"] = location
            listing["price"] = price
            listing["category"] = category
            listing["season"] = season

            if image:

                filename = f"{listing_id}_{image.filename}"
                filepath = os.path.join(UPLOAD_DIR, filename)

                with open(filepath, "wb") as buffer:
                    shutil.copyfileobj(image.file, buffer)

                listing["image"] = (
                    f"http://127.0.0.1:8000/uploads/{filename}"
                )

            return {
                "message": "Listing updated successfully",
                "listing": listing
            }

    raise HTTPException(
        status_code=404,
        detail="Listing not found"
    )

@app.delete(
    "/api/listings/{listing_id}",
    status_code=status.HTTP_200_OK
)
def delete_listing(listing_id: int):

    for listing in listings:
        if listing["id"] == listing_id:
            if "uploads/" in listing["image"]:
                filename = listing["image"].split("/")[-1]

                filepath = os.path.join(
                UPLOAD_DIR,
                filename
                )

            if os.path.exists(filepath):
                os.remove(filepath)
            listings.remove(listing)

            return {
                "message": "Listing deleted successfully"
            }

    raise HTTPException(
        status_code=404,
        detail="Listing not found"
    )

@app.get("/api/dashboard", status_code=status.HTTP_200_OK)
def get_dashboard():
    time.sleep(2)  # temporary testing
    total_listings = len(listings)

    average_price = (
        sum(listing["price"] for listing in listings) / total_listings
        if total_listings > 0
        else 0
    )

    locations = len(
        set(listing["location"] for listing in listings)
    )

    return {
        "totalListings": total_listings,
        "averagePrice": round(average_price),
        "locationsCovered": locations,
        "recentListings": listings[-3:]
    }

@app.post(
    "/api/ai-planner",
    status_code=status.HTTP_200_OK
)
def ai_planner(request: PlannerRequest):
    time.sleep(2)  # temporary for testing loader
    recommendations = []

    for listing in listings:

        score = 0

        if listing["price"] <= request.budget:
            score += 40

        if listing["season"].lower() == request.season.lower():
            score += 30

        if listing["category"].lower() == request.travel_type.lower():
            score += 30

        recommendations.append({
            "id": listing["id"],
            "title": listing["title"],
            "location": listing["location"],
            "description": listing["description"],
            "price": listing["price"],
            "image": listing["image"],
            "score": score
        })

    recommendations.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return {
        "success": True,
        "count": len(recommendations[:3]),
        "recommendations": recommendations[:3]
    }

@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception
):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal Server Error"
        }
    )