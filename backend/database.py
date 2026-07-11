from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get MongoDB connection details
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Create MongoDB client
client = MongoClient(MONGO_URI)

# Select database
db = client[DATABASE_NAME]

# Collections
listings_collection = db["listings"]
users_collection = db["users"]

try:
    client.admin.command("ping")
    print("Connected to MongoDB successfully!")
except Exception as e:
    print("Connection failed:", e)