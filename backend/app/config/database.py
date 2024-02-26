#database.py
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_DETAILS = os.getenv("MONGODB_URL")

client = MongoClient(MONGO_DETAILS)
db = client["codesync"]
users_collection = db["users"]
chat_messages_collection = db["chat_messages"]
comments_collection = db["comments"]
token_collection = db["tokens"]