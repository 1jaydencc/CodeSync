#main.py
from fastapi import FastAPI
from routers.auth_router import router as auth_router
from routers.websocket_router import router as websocket_router
from routers.chat_router import router as chat_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  
    allow_headers=["*"],
)


app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(websocket_router)
app.include_router(chat_router, tags=["Chat"])
