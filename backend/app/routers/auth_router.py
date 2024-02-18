# auth_router.py
from fastapi import APIRouter, HTTPException, Body, Depends
from schemas.user_schema import UserSchema, UserDisplay
from config.database import users_collection
from passlib.context import CryptContext
from fastapi.encoders import jsonable_encoder

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/sign-up/", response_model=UserDisplay)
async def sign_up(user: UserSchema = Body(...)):
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
