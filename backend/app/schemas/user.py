from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    role: Optional[str] = "user"

class UserCreate(UserBase):
    password: str
    created_by: Optional[UUID] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None
    updated_by: Optional[UUID] = None

class UserResponse(BaseModel):
    id: UUID
    email: str
    role: str
    is_active: bool
    created_by: Optional[UUID] = None
    updated_by: Optional[UUID] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
