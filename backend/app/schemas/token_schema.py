#schemas/token_schema

from datetime import datetime, timedelta
from pydantic import BaseModel, Field

class token_schema(BaseModel):
    user_id: str = Field(...)
    token: str = Field(...)
    created_at: datetime = Field(default_factory=datetime.now)
    expires_at: datetime = Field(default_factory=lambda: datetime.utcnow() 
                                  + timedelta(minutes=5))