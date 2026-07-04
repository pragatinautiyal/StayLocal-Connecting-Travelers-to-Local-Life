from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

from database import users_collection
from security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

class RegisterRequest(BaseModel):
    fullName: str
    email: EmailStr
    password: str
    role: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: RegisterRequest):

    # Check if email already exists
    existing_user = users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Validate role
    if user.role not in ["traveller", "host"]:
        raise HTTPException(
            status_code=400,
            detail="Role must be either 'traveller' or 'host'"
        )

    # Hash password
    hashed_password = hash_password(user.password)

    # Create user document
    user_data = {
        "fullName": user.fullName,
        "email": user.email,
        "password": hashed_password,
        "role": user.role,
        "phone": None,
        "profileImage": None,
        "isVerified": False,
        "verificationStatus": "none"
    }

    # Insert into MongoDB
    users_collection.insert_one(user_data)

    return {
        "success": True,
        "message": "User registered successfully"
    }

@router.post("/login")
def login(user: LoginRequest):

    # Find user
    existing_user = users_collection.find_one({"email": user.email})

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Create JWT Token
    token = create_access_token(
        {
            "email": existing_user["email"],
            "role": existing_user["role"]
        }
    )

    return {
        "success": True,
        "message": "Login successful",
        "token": token,
        "user": {
            "fullName": existing_user["fullName"],
            "email": existing_user["email"],
            "role": existing_user["role"],
            "isVerified": existing_user["isVerified"]
        }
    }