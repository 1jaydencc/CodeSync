# auth_router.py
from fastapi import APIRouter, HTTPException, Body, Depends
from schemas.user_schema import UserSchema, UserDisplay
from schemas.token_schema import token_schema
from datetime import datetime, timedelta
from config.database import users_collection, token_collection
from passlib.context import CryptContext
from fastapi.encoders import jsonable_encoder
from bson import ObjectId
from pydantic import ValidationError
import re
import secrets
from typing import Tuple
import logging

logger = logging.getLogger(__name__)

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_token(length: int = 64) -> str:
    return secrets.token_urlsafe(length)

def check_password_policy(password: str) -> Tuple[bool, str]:
    min_length = 8
    requires_uppercase = True
    requires_special_char = True

    if len(password) < min_length:
        return False, "Password must be at least 8 characters long"

    if requires_uppercase and not password[0].isupper:
        return False, "Password must begin with a capital letter"

    if requires_special_char and not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain a special character"

    return True, "PaswordWorks"

@router.post("/sign-up/", response_model=UserDisplay)
async def sign_up(user: UserSchema = Body(...)):
    try:
        validated_user = UserSchema(**user.dict())
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    is_valid, error_message = check_password_policy(user.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_message)
    user_dict = user.dict()
    user_dict['password'] = pwd_context.hash(user_dict['password'])
    existing_user = await users_collection.find_one({"email": user_dict['email']})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    await users_collection.insert_one(user_dict)
    return UserDisplay(**user_dict)

@router.post("/login/")
async def login(email: str = Body(...), password: str = Body(...)):
    user = await users_collection.find_one({"email": email})
    if not user or not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    return {"message": "Login successful"}

@router.post("/password-reset/request/")
async def request_password_reset(email: str = Body(...)):
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    
    token = generate_token()
    
    token_data = {
        "user_id": str(user["_id"]),
        "token": token,
        "expires_at": datetime.utcnow() + timedelta(minutes=15)
    }
    await token_collection.insert_one(token_data)
    
    # TODO: Send an email with the reset link containing the token
    
    return {"message": "Password reset link sent"}

@router.post("/password-reset/validate/")
async def validate_password_reset(token_data: token_schema = Body(...), new_password: str = Body(...)):
    
    token = await token_collection.find_one({"token": token_data.token})
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    if token["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token expired")
    
    user = await users_collection.find_one({"_id": ObjectId(token["user_id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    is_valid, error_message = check_password_policy(new_password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_message)
    
    hashed_password = pwd_context.hash(new_password)
    await users_collection.update_one({"_id": user["_id"]}, {"$set": {"password": hashed_password}})
    await token_collection.delete_one({"_id": token["_id"]})
    
    return {"message": "Password reset successful"}
