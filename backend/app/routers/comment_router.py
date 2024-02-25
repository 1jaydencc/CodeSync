# routers/comment_router.py

from fastapi import APIRouter, HTTPException, Body
from schemas.comment_schema import CommentSchema, CommentDisplay
from config.database import comments_collection
from datetime import datetime
from typing import List

router = APIRouter()

@router.get("/{path}", response_model=CommentDisplay)
async def fetch_comments(path: str, comment: CommentSchema = Body(...)):
    comment = await comments_collection.find({"path": path}).to_list(100)
    if comment:
        return comment