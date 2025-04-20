from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class LoginUser(BaseModel):
    email: str
    password: str

class CreateUserModel(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    username: str = Field(..., min_length=3, max_length=30)
    gender: Optional[str] = None
    date_of_birth: Optional[datetime] = None