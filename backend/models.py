from pydantic import BaseModel

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