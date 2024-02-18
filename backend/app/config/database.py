#database.py
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables

MONGO_DETAILS = os.getenv("MONGODB_URL")

client = MongoClient(MONGO_DETAILS)
db = client[os.getenv("DATABASE_NAME")]
users_collection = db[os.getenv("USERS_COLLECTION_NAME")]