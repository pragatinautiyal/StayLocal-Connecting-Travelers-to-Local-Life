from pydantic import BaseModel
from typing import Optional
from typing import List
from datetime import datetime

class Listing(BaseModel):
    id: int

    # Owner
    hostId: str

    # Basic Information
    title: str
    description: str

    # Classification
    category: str          # Stay, Food & Drink, Experience, Workshop, Shopping, Event, Wellness
    listingType: str       # Homestay, Cafe, Pottery Workshop, Trek, Restaurant, etc.

    # Location
    city: str
    state: str
    address: str

    # Pricing
    price: int
    priceUnit: str         # Per Night, Per Person, Per Ticket, Average Spend, Starting From

    # Media
    images: List[str]

class User(BaseModel):
    fullName: str
    email: str
    password: str
    role: str

    phone: Optional[str] = None
    profileImage: Optional[str] = None

    isVerified: bool = False
    verificationStatus: str = "none"

class Wishlist(BaseModel):
    userId: str
    listingId: int
    createdAt: datetime = datetime.utcnow()

class AIPlannerRequest(BaseModel):
    destination: str
    budget: int
    days: int
    travel_type: str

class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str