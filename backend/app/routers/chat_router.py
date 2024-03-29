# routers/chat_router.py
from fastapi import APIRouter, HTTPException, Body
from schemas.chat_message_schema import ChatMessageSchema, ChatMessageDisplay
from config.database import chat_messages_collection
from datetime import datetime
from typing import List

router = APIRouter()

@router.post("/messages/", response_model=ChatMessageDisplay)
async def send_message(message: ChatMessageSchema = Body(...)):
    message_dict = message.dict()
    message_dict["timestamp"] = datetime.utcnow()  # Ensure timestamp is set at the time of message creation
    new_message = await chat_messages_collection.insert_one(message_dict)
    created_message = await chat_messages_collection.find_one({"_id": new_message.inserted_id})
    return created_message

@router.get("/messages/", response_model=List[ChatMessageDisplay])
async def fetch_messages():
    messages = await chat_messages_collection.find().sort("timestamp", -1).to_list(100)  # Fetches the latest 100 messages
    return messages
