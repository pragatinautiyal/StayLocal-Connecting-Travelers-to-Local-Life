from fastapi import FastAPI, Body, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import Request
from fastapi.responses import JSONResponse

app = FastAPI()

class Listing(BaseModel):
    id: int
    title: str
    description: str
    location: str
    price: int

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        "price": 800
    },
    {
        "id": 2,
        "title": "Mountain View Homestay",
        "description": "Luxury balcony room overlooking mountains.",
        "location": "Mussoorie",
        "price": 1200
    }
]

@app.get("/")
def home():
    return {
        "message": "Stay Local Backend Running"
    }

@app.get("/api/listings")
def get_listings():
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
def create_listing(listing: Listing):
    listing_dict = listing.model_dump()

    for existing in listings:
        if existing["id"] == listing_dict["id"]:
            raise HTTPException(
                status_code=400,
                detail="Listing ID already exists"
            )

    listings.append(listing_dict)

    return {
        "message": "Listing created successfully",
        "listing": listing_dict
    }

@app.put("/api/listings/{listing_id}", status_code=status.HTTP_200_OK)
def update_listing(listing_id: int, updated_listing: Listing):

    updated_data = updated_listing.model_dump()

    for i in range(len(listings)):
        if listings[i]["id"] == listing_id:
            listings[i] = updated_data

            return {
                "message": "Listing updated successfully",
                "listing": updated_data
            }

    raise HTTPException(
        status_code=404,
        detail="Listing not found"
    )

@app.delete("/api/listings/{listing_id}", status_code=status.HTTP_200_OK)
def delete_listing(listing_id: int):

    for listing in listings:
        if listing["id"] == listing_id:
            listings.remove(listing)

            return {
                "message": "Listing deleted successfully"
            }

    raise HTTPException(
        status_code=404,
        detail="Listing not found"
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal Server Error"
        }
    )

