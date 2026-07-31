import os
import shutil
import time
import random
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException, status, Request, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler

from database import (
    users_collection,
    listings_collection,
    wishlist_collection
)
from models import Listing, Wishlist, AIPlannerRequest, ChangePasswordRequest
from auth import router as auth_router
from security import get_current_user, require_host, verify_password, hash_password
from services.ai_service import (
    generate_itinerary,
    get_listings_by_city,
    build_prompt
)
from limiter import limiter

app = FastAPI(
    title="StayLocal API",
    description="Backend API for StayLocal platform",
    version="1.0.0"
)

# Handle reverse proxies (Render, Railway, Heroku, AWS, etc.)
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts=["*"])

# Configure CORS for local development and production deployment
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload directory initialization
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Rate limiter setup
app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)
app.add_middleware(SlowAPIMiddleware)

# Include Authentication Router
app.include_router(auth_router)


# Helper function to generate full dynamic URLs for static uploaded files
def get_base_url(request: Request) -> str:
    """Dynamically construct base URL from incoming request headers."""
    return str(request.base_url).rstrip("/")


@app.get("/", status_code=status.HTTP_200_OK)
def home():
    return {
        "status": "online",
        "message": "Stay Local Backend Running Successfully"
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
def get_my_listings(current_user=Depends(require_host)):
    listings = list(
        listings_collection.find(
            {"hostId": str(current_user["_id"])},
            {"_id": 0}
        )
    )

    return {
        "success": True,
        "count": len(listings),
        "listings": listings
    }


@app.get("/api/listings/search")
def search_listings(
    city: Optional[str] = None,
    category: Optional[str] = None,
    listingType: Optional[str] = None,
    minPrice: Optional[int] = None,
    maxPrice: Optional[int] = None
):
    query = {}

    # Search by city (case-insensitive substring)
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

    # Filter by price range
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
            status_code=status.HTTP_404_NOT_FOUND,
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
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Listing not found"
    )


@app.post("/api/listings", status_code=status.HTTP_201_CREATED)
async def create_listing(
    request: Request,
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
        listing_id = random.randint(100000, 999999)
        existing = listings_collection.find_one({"id": listing_id})
        if not existing:
            break

    # Save uploaded image
    filename = f"{listing_id}_{image.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Dynamic base URL for deployment environments
    base_url = get_base_url(request)
    image_url = f"{base_url}/uploads/{filename}"

    # Create listing document
    listing = {
        "id": listing_id,
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
    request: Request,
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )

    # Ensure the logged-in host owns this listing
    if existing["hostId"] != str(current_user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own listings"
        )

    # Keep existing image unless a new one is uploaded
    image_urls = existing.get("images", [])

    if image:
        filename = f"{int(time.time())}_{image.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        base_url = get_base_url(request)
        image_url = f"{base_url}/uploads/{filename}"
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
def delete_listing(
    listing_id: int,
    current_user=Depends(require_host)
):
    listing = listings_collection.find_one(
        {"id": listing_id},
        {"_id": 0}
    )

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )

    if listing["hostId"] != str(current_user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own listings"
        )

    # Delete image files if they exist on disk
    images = listing.get("images", [])
    for image in images:
        if "uploads/" in image:
            filename = image.split("/")[-1]
            filepath = os.path.join(UPLOAD_DIR, filename)

            if os.path.exists(filepath):
                try:
                    os.remove(filepath)
                except OSError:
                    pass

    # Delete from MongoDB
    listings_collection.delete_one({"id": listing_id})

    return {
        "success": True,
        "message": "Listing deleted successfully"
    }


@app.get("/api/dashboard", status_code=status.HTTP_200_OK)
def get_dashboard(current_user=Depends(require_host)):
    all_listings = list(
        listings_collection.find(
            {"hostId": str(current_user["_id"])},
            {"_id": 0}
        )
    )

    total_listings = len(all_listings)

    average_price = (
        sum(listing["price"] for listing in all_listings) / total_listings
        if total_listings > 0
        else 0
    )

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


@app.post("/api/ai-planner")
def ai_planner(request: AIPlannerRequest):
    listings = get_listings_by_city(request.destination)
    prompt = build_prompt(request, listings)

    try:
        itinerary = generate_itinerary(prompt)

        return {
            "success": True,
            "data": {
                "itinerary": itinerary,
                "recommendedListings": listings
            }
        }

    except Exception as e:
        print("AI Service Error:", e)
        return {
            "success": False,
            "message": "Failed to generate AI itinerary. Please try again later."
        }


@app.post("/api/wishlist/{listing_id}")
def add_to_wishlist(
    listing_id: int,
    current_user=Depends(get_current_user)
):
    listing = listings_collection.find_one({"id": listing_id})

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )

    existing = wishlist_collection.find_one(
        {
            "userId": str(current_user["_id"]),
            "listingId": listing_id
        }
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
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
    listing_id: int,
    current_user=Depends(get_current_user)
):
    result = wishlist_collection.delete_one(
        {
            "userId": str(current_user["_id"]),
            "listingId": listing_id
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wishlist item not found"
        )

    return {
        "success": True,
        "message": "Removed from wishlist"
    }


@app.get("/api/wishlist/ids")
def get_wishlist_ids(current_user=Depends(get_current_user)):
    wishlist_items = list(
        wishlist_collection.find(
            {"userId": str(current_user["_id"])},
            {"_id": 0, "listingId": 1}
        )
    )

    return [item["listingId"] for item in wishlist_items]


@app.get("/api/wishlist")
def get_wishlist(current_user=Depends(get_current_user)):
    wishlist_items = list(
        wishlist_collection.find(
            {"userId": str(current_user["_id"])},
            {"_id": 0}
        )
    )

    listing_ids = [item["listingId"] for item in wishlist_items]

    listings = list(
        listings_collection.find(
            {"id": {"$in": listing_ids}},
            {"_id": 0}
        )
    )
    return listings


@app.put("/api/change-password")
async def change_password(
    data: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
):
    user = users_collection.find_one({"email": current_user["email"]})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not verify_password(data.currentPassword, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    hashed_password = hash_password(data.newPassword)

    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hashed_password}}
    )

    return {
        "success": True,
        "message": "Password changed successfully"
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled Global Error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal server error occurred."
        }
    )