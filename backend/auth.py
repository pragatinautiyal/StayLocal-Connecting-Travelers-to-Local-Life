from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

from google.oauth2 import id_token
from google.auth.transport import requests
import os
from dotenv import load_dotenv

from limiter import limiter
from fastapi import Request

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

class GoogleLoginRequest(BaseModel):
    token: str

class GoogleRegisterRequest(BaseModel):
    email: EmailStr
    fullName: str
    profileImage: str | None = None
    role: str

@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/15minutes")
def register(request: Request, user: RegisterRequest):

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
@limiter.limit("5/15minutes")
def login(
    request: Request,
    user: LoginRequest
):

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

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

@router.post("/google")
@limiter.limit("5/15minutes")
def google_login(
    request: Request,
    body: GoogleLoginRequest
):

    try:
        idinfo = id_token.verify_oauth2_token(
            body.token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google token"
        )

    email = idinfo["email"]
    full_name = idinfo.get("name", "")
    picture = idinfo.get("picture", "")

    # Check if the user already exists
    existing_user = users_collection.find_one(
        {"email": email}
    )

    # Existing Google user -> Login
    if existing_user:

        token = create_access_token(
            {
                "email": existing_user["email"],
                "role": existing_user["role"]
            }
        )

        return {
            "newUser": False,
            "token": token,
            "user": {
                "fullName": existing_user["fullName"],
                "email": existing_user["email"],
                "role": existing_user["role"],
                "isVerified": existing_user["isVerified"],
                "profileImage": existing_user.get("profileImage")
            }
        }

    # First-time Google user
    return {
        "newUser": True,
        "email": email,
        "fullName": full_name,
        "profileImage": picture
    }

@router.post("/google/complete-registration")
@limiter.limit("5/15minutes")
def complete_google_registration(
    request: Request,
    user: GoogleRegisterRequest
):
    # Validate role
    if user.role not in ["traveller", "host"]:
        raise HTTPException(
            status_code=400,
            detail="Role must be either 'traveller' or 'host'"
        )

    # Check whether the account already exists
    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Account already exists. Please login with Google."
        )

    # Create Google user
    user_data = {
        "fullName": user.fullName,
        "email": user.email,
        "password": "",  # No password for Google users
        "role": user.role,
        "phone": None,
        "profileImage": user.profileImage,
        "isVerified": True,
        "verificationStatus": "google"
    }

    users_collection.insert_one(user_data)

    # Fetch newly created user
    created_user = users_collection.find_one(
        {"email": user.email}
    )

    # Generate JWT
    token = create_access_token(
        {
            "email": created_user["email"],
            "role": created_user["role"]
        }
    )

    return {
        "success": True,
        "message": "Google registration successful",
        "token": token,
        "user": {
            "fullName": created_user["fullName"],
            "email": created_user["email"],
            "role": created_user["role"],
            "isVerified": created_user["isVerified"],
            "profileImage": created_user.get("profileImage")
        }
    }