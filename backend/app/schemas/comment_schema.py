# schemas/comment_schema.py

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CommentSchema(BaseModel):
    comment_id: int = Field(...)    # unique id for each comment
    user_id: str = Field(...)       # id of the user who left the comment
    text: str = Field(...)          # text in the comment
    
    path: str = Field(...)     # path to the file where the comment was left
    line: int = Field(...)          # line number where the comment was left
    char_start: int = Field(...)    # starting character index of the comment
    char_end: int = Field(...)      # ending character index of the comment
    
    timestamp: datetime = Field(default_factory=datetime.utcnow)  # time when the comment was left
    
    task_id: Optional[str] = Field(None)    # id of the task that the comment is related to
    
class CommentDisplay(BaseModel):
    comment_id: int
    user_id: str
    text: str
    
    path: str
    line: int
    char_start: int
    char_end: int
    timestamp: datetime
    
    task_id: Optional[str]
    
    class Config:
        orm_mode = True