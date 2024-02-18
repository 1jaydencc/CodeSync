# schemas/chat_message_schema.py

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ChatMessageSchema(BaseModel):
    sender_email: str = Field(...)
    message_content: str = Field(...)
    room_id: Optional[str] = Field(None)  # Optional, if you plan to implement chat rooms
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatMessageDisplay(BaseModel):
    sender_email: str
    message_content: str
    room_id: Optional[str]
    timestamp: datetime

    class Config:
        orm_mode = True
