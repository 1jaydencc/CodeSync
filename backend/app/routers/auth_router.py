# auth_router.py
from fastapi import APIRouter, HTTPException, Body, Depends
from schemas.user_schema import UserSchema, UserDisplay
from config.database import users_collection
from passlib.context import CryptContext
from fastapi.encoders import jsonable_encoder
from pydantic import ValidationError
import re
from typing import Tuple

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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

    return True

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
