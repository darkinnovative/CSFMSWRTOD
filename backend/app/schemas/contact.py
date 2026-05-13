from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactMessageResponse(ContactMessageCreate):
    id: int
    user_id: Optional[int]
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserDetailResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str

class ContactMessageWithUserResponse(ContactMessageResponse):
    user: Optional[UserDetailResponse] = None

    class Config:
        from_attributes = True
