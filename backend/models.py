from pydantic import BaseModel
from typing import Optional

class Listing(BaseModel):
    id: int
    hostId: str
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

class User(BaseModel):
    fullName: str
    email: str
    password: str
    role: str

    phone: Optional[str] = None
    profileImage: Optional[str] = None

    isVerified: bool = False
    verificationStatus: str = "none"