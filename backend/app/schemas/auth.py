"""
Authentication schemas for user login, registration, and token management.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    username: str
    full_name: str


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str


class UserResponse(UserBase):
    """Schema for user response."""
    id: int
    role: str
    company_id: int
    is_active: bool

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    """Schema for login request."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema for token response."""
    access_token: str
    token_type: str
    user: UserResponse


class PasswordChange(BaseModel):
    """Schema for password change."""
    old_password: str
    new_password: str
