#main.py
from fastapi import FastAPI
from routers.auth_router import router as auth_router
from routers.websocket_router import router as websocket_router
from routers.chat_router import router as chat_router

app = FastAPI()

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(websocket_router)
app.include_router(chat_router, tags=["Chat"])