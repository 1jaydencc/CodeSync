# user_schema.py
from pydantic import BaseModel, Field, EmailStr

class UserSchema(BaseModel):
    email: str = Field(...)
    first_name: str = Field(...)
    password: str = Field(...)

class UserDisplay(BaseModel):
    email: EmailStr
    first_name: str

    class Config:
        orm_mode = True
