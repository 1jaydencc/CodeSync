#main.py
from fastapi import FastAPI
from .routers.auth_router import router as auth_router

app = FastAPI()

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
