from database import listings_collection
from fastapi import FastAPI, HTTPException, status, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from models import Listing, PlannerRequest, Recommendation
from auth import router as auth_router
from security import get_current_user, require_host
from fastapi import Depends

import os
import shutil

import time

from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler
from limiter import limiter

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
    time.sleep(2)
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

@app.get("/api/listings/search", status_code=status.HTTP_200_OK)
def search_listings(location: str):

    result = list(
        listings_collection.find(
            {
                "location": {
                    "$regex": location,
                    "$options": "i"
                }
            },
            {"_id": 0}
        )
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="No listings found for this location"
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
    id: int = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    price: int = Form(...),
    category: str = Form(...),
    season: str = Form(...),
    image: UploadFile = File(...),
    current_user=Depends(require_host)
):
    
    existing = listings_collection.find_one({"id": id})

    if existing:
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
        "hostId": current_user["_id"],
        "title": title,
        "description": description,
        "location": location,
        "price": price,
        "category": category,
        "season": season,
        "image": image_url
    }

    listings_collection.insert_one(listing)

    return {
        "success": True,
        "message": "Listing created successfully"
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
    image: UploadFile = File(None),
    current_user=Depends(require_host)
):

    existing = listings_collection.find_one(
    {"id": listing_id},
    {"_id": 0}
)

    if not existing:
        raise HTTPException(
        status_code=404,
        detail="Listing not found"
    )

    if existing["hostId"] != current_user["_id"]:
        raise HTTPException(
        status_code=403,
        detail="You can only update your own listings"
    )

    image_url = existing["image"]

    if image:
        import time

        filename = f"{int(time.time())}_{image.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        image_url = f"http://127.0.0.1:8000/uploads/{filename}"

    updated_listing = {
    "id": listing_id,
    "hostId": existing["hostId"],
    "title": title,
    "description": description,
    "location": location,
    "price": price,
    "category": category,
    "season": season,
    "image": image_url
}

    listings_collection.update_one(
        {"id": listing_id},
        {"$set": updated_listing}
    )

    return {
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

    if listing["hostId"] != current_user["_id"]:
        raise HTTPException(
        status_code=403,
        detail="You can only delete your own listings"
    )

    # Delete image file if it exists
    if "uploads/" in listing["image"]:
        filename = listing["image"].split("/")[-1]
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
    time.sleep(2)

    all_listings = list(
    listings_collection.find(
        {"hostId": current_user["_id"]},
        {"_id":0}
    )
)

    total_listings = len(all_listings)

    average_price = (
        sum(listing["price"] for listing in all_listings) / total_listings
        if total_listings > 0
        else 0
    )

    locations = len(
        set(listing["location"] for listing in all_listings)
    )

    return {
        "totalListings": total_listings,
        "averagePrice": round(average_price),
        "locationsCovered": locations,
        "recentListings": all_listings[-3:]
    }

@app.post(
    "/api/ai-planner",
    status_code=status.HTTP_200_OK
)
def ai_planner(request: PlannerRequest):
    time.sleep(2)

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

