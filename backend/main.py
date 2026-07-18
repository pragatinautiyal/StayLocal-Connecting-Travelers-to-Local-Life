from database import (
    users_collection,
    listings_collection,
    wishlist_collection
)
from fastapi import FastAPI, HTTPException, status, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from models import Listing, PlannerRequest, Recommendation, Wishlist
from auth import router as auth_router
from security import get_current_user, require_host
from services.ai_service import (
    generate_itinerary,
    get_listings_by_city,
    build_prompt
)
from models import AIPlannerRequest

import os
import shutil

import time
import random
from typing import Optional
from fastapi import Form, File, UploadFile, HTTPException, Depends, status

from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler
from limiter import limiter
from datetime import datetime


app = FastAPI()
app.include_router(auth_router)

UPLOAD_DIR = "uploads"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)

app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", status_code=status.HTTP_200_OK)
def home():
    return {
        "message": "Stay Local Backend Running"
    }

@app.get("/api/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "success": True,
        "user": current_user
    }

@app.get("/api/listings")
def get_listings():
    all_listings = list(listings_collection.find({}, {"_id": 0}))

    return all_listings

@app.get("/api/my-listings")
def get_my_listings(
    current_user=Depends(require_host)
):
    listings = list(
        listings_collection.find(
            {"hostId": current_user["_id"]},
            {"_id": 0}
        )
    )

    return {
        "success": True,
        "count": len(listings),
        "listings": listings
    }

from typing import Optional

@app.get("/api/listings/search")
def search_listings(
    city: Optional[str] = None,
    category: Optional[str] = None,
    listingType: Optional[str] = None,
    minPrice: Optional[int] = None,
    maxPrice: Optional[int] = None
):
    query = {}

    # Search by city
    if city:
        query["city"] = {
            "$regex": city,
            "$options": "i"
        }

    # Filter by category
    if category:
        query["category"] = category

    # Filter by listing type
    if listingType:
        query["listingType"] = listingType

    # Filter by price
    if minPrice is not None or maxPrice is not None:
        query["price"] = {}

        if minPrice is not None:
            query["price"]["$gte"] = minPrice

        if maxPrice is not None:
            query["price"]["$lte"] = maxPrice

    result = list(
        listings_collection.find(
            query,
            {"_id": 0}
        )
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="No listings found"
        )

    return result

@app.get("/api/listings/{listing_id}", status_code=status.HTTP_200_OK)
def get_listing(listing_id: int):

    listing = listings_collection.find_one(
        {"id": listing_id},
        {"_id": 0}
    )

    if listing:
        return listing

    raise HTTPException(
        status_code=404,
        detail="Listing not found"
    )

@app.post("/api/listings", status_code=status.HTTP_201_CREATED)
async def create_listing(
    title: str = Form(...),
    description: str = Form(...),

    category: str = Form(...),
    listingType: str = Form(...),

    city: str = Form(...),
    state: str = Form(...),
    address: str = Form(...),

    price: int = Form(...),
    priceUnit: str = Form(...),

    image: UploadFile = File(...),

    current_user=Depends(require_host)
):
    # Generate a unique random listing ID
    while True:
        id = random.randint(100000, 999999)

        existing = listings_collection.find_one({"id": id})

        if not existing:
            break

    # Save uploaded image
    filename = f"{id}_{image.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    image_url = f"http://127.0.0.1:8000/uploads/{filename}"

    # Create listing document
    listing = {
        "id": id,
        "hostId": str(current_user["_id"]),

        "title": title,
        "description": description,

        "category": category,
        "listingType": listingType,

        "city": city,
        "state": state,
        "address": address,

        "price": price,
        "priceUnit": priceUnit,

        # Future-ready for multiple images
        "images": [image_url]
    }

    # Insert into MongoDB
    listings_collection.insert_one(listing)

    listing.pop("_id", None)

    return {
    "success": True,
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

    category: str = Form(...),
    listingType: str = Form(...),

    city: str = Form(...),
    state: str = Form(...),
    address: str = Form(...),

    price: int = Form(...),
    priceUnit: str = Form(...),

    image: UploadFile = File(None),

    current_user=Depends(require_host)
):

    # Check if listing exists
    existing = listings_collection.find_one(
        {"id": listing_id},
        {"_id": 0}
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Listing not found"
        )

    # Ensure the logged-in host owns this listing
    if existing["hostId"] != str(current_user["_id"]):
        raise HTTPException(
            status_code=403,
            detail="You can only update your own listings"
        )

    # Keep existing image unless a new one is uploaded
    image_urls = existing["images"]

    if image:
        filename = f"{int(time.time())}_{image.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        image_url = f"http://127.0.0.1:8000/uploads/{filename}"
        image_urls = [image_url]

    # Updated listing data
    updated_listing = {
        "id": listing_id,
        "hostId": existing["hostId"],

        "title": title,
        "description": description,

        "category": category,
        "listingType": listingType,

        "city": city,
        "state": state,
        "address": address,

        "price": price,
        "priceUnit": priceUnit,

        "images": image_urls
    }

    # Update MongoDB document
    listings_collection.update_one(
        {"id": listing_id},
        {"$set": updated_listing}
    )

    return {
        "success": True,
        "message": "Listing updated successfully",
        "listing": updated_listing
    }

@app.delete(
    "/api/listings/{listing_id}",
    status_code=status.HTTP_200_OK
)
def delete_listing(listing_id: int,
                   current_user=Depends(require_host)):

    listing = listings_collection.find_one(
        {"id": listing_id},
        {"_id": 0}
    )

    if not listing:
        raise HTTPException(
            status_code=404,
            detail="Listing not found"
        )

    if listing["hostId"] != str(current_user["_id"]):
        raise HTTPException(
        status_code=403,
        detail="You can only delete your own listings"
    )
    
    # Delete image file if it exists
    images = listing.get("images", [])

    for image in images:
        if "uploads/" in image:
            filename = image.split("/")[-1]
            filepath = os.path.join(UPLOAD_DIR, filename)

            if os.path.exists(filepath):
                os.remove(filepath)

    # Delete from MongoDB
    listings_collection.delete_one({"id": listing_id})

    return {
        "message": "Listing deleted successfully"
    }

@app.get("/api/dashboard", status_code=status.HTTP_200_OK)
def get_dashboard(
    current_user=Depends(require_host)
):

    all_listings = list(
        listings_collection.find(
            {
                "hostId": str(current_user["_id"])
            },
            {
                "_id": 0
            }
        )
    )

    total_listings = len(all_listings)

    average_price = (
        sum(listing["price"] for listing in all_listings) / total_listings
        if total_listings > 0
        else 0
    )

    # Count unique cities
    locations = len(
        set(
            listing["city"]
            for listing in all_listings
        )
    )

    return {
        "totalListings": total_listings,
        "averagePrice": round(average_price),
        "locationsCovered": locations,
        "recentListings": all_listings[-3:]
    }

'''
@app.post(
    "/api/ai-planner",
    status_code=status.HTTP_200_OK
)
def ai_planner(request: PlannerRequest):

    all_listings = list(
        listings_collection.find({}, {"_id": 0})
    )

    recommendations = []

    for listing in all_listings:

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
    }'''
@app.post("/api/ai-planner")
def ai_planner(request: AIPlannerRequest):
    # Fetch actual local listings for the target city from the database
    listings = get_listings_by_city(request.destination) #[cite: 1]
    prompt = build_prompt(request, listings) #[cite: 1]

    try:
        itinerary = generate_itinerary(prompt) #[cite: 1]

        # Return BOTH the itinerary text and your clean DB objects to the frontend
        return {
            "success": True,
            "data": {
                "itinerary": itinerary,
                "recommendedListings": listings  # Send matching listings over!
            }
        }

    except Exception:
        return {
            "success": False,
            "message": "AI service is temporarily unavailable. Please try again later."
        }


@app.post("/api/wishlist/{listing_id}")
def add_to_wishlist(
    listing_id: int,
    current_user=Depends(get_current_user)
):

    # Check listing exists
    listing = listings_collection.find_one(
        {"id": listing_id}
    )

    if not listing:
        raise HTTPException(
            status_code=404,
            detail="Listing not found"
        )

    # Check already saved
    existing = wishlist_collection.find_one(
        {
            "userId": str(current_user["_id"]),
            "listingId": listing_id
        }
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Listing already in wishlist"
        )

    wishlist_item = {
        "userId": str(current_user["_id"]),
        "listingId": listing_id,
        "createdAt": datetime.utcnow()
    }

    wishlist_collection.insert_one(wishlist_item)

    return {
        "success": True,
        "message": "Added to wishlist"
    }

@app.delete("/api/wishlist/{listing_id}")
def remove_from_wishlist(
    listing_id:int,
    current_user=Depends(get_current_user)
):

    result = wishlist_collection.delete_one(
        {
            "userId":str(current_user["_id"]),
            "listingId":listing_id
        }
    )


    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Wishlist item not found"
        )


    return {
        "success":True,
        "message":"Removed from wishlist"
    }

@app.get("/api/wishlist/ids")
def get_wishlist_ids(
    current_user=Depends(get_current_user)
):
    wishlist_items = list(
        wishlist_collection.find(
            {
                "userId": str(current_user["_id"])
            },
            {
                "_id":0,
                "listingId":1
            }
        )
    )

    return [
        item["listingId"]
        for item in wishlist_items
    ]

@app.get("/api/wishlist")
def get_wishlist(
    current_user=Depends(get_current_user)
):
    wishlist_items = list(
        wishlist_collection.find(
            {
                "userId": str(current_user["_id"])
            },
            {
                "_id": 0
            }
        )
    )

    listing_ids = [
        item["listingId"]
        for item in wishlist_items
    ]

    listings = list(
        listings_collection.find(
            {
                "id": {
                    "$in": listing_ids
                }
            },
            {
                "_id": 0
            }
        )
    )
    return listings

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

