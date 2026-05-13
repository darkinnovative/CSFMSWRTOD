"""
Centralized authentication and authorization utilities.
"""
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
import logging
from dotenv import load_dotenv
from typing import Optional

from app.database.database import get_db
from app.database.models import User

load_dotenv()

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
if SECRET_KEY == "your-secret-key-change-in-production":
    logging.warning("WARNING: Using default SECRET_KEY. Please set a strong SECRET_KEY in your .env file for production.")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120  # Reduced to 2 hours for better security


async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> User:
    """
    Extract and validate current user from Bearer token.
    Authorization header format: Bearer <token>
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Check if authorization header exists
    if not authorization:
        print("[AUTH ERROR] No authorization header provided")
        raise credentials_exception
    
    # Parse authorization header
    try:
        parts = authorization.split()
        if len(parts) != 2:
            print(f"[AUTH ERROR] Invalid authorization header format: got {len(parts)} parts, expected 2")
            raise credentials_exception
        
        scheme, token = parts
        if scheme.lower() != "bearer":
            print(f"[AUTH ERROR] Invalid scheme: {scheme}, expected Bearer")
            raise credentials_exception
    except ValueError as e:
        print(f"[AUTH ERROR] Error parsing authorization header: {str(e)}")
        raise credentials_exception
    
    # Validate token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            print("[AUTH ERROR] Token missing 'sub' claim")
            raise credentials_exception
        user_id: int = int(user_id_str)
    except JWTError as e:
        print(f"[AUTH ERROR] JWT validation failed: {str(e)}")
        raise credentials_exception

    # Get user from database
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        print(f"[AUTH ERROR] User not found for ID: {user_id}")
        raise credentials_exception
    
    print(f"[AUTH SUCCESS] User authenticated: {user.email}")
    return user


async def verify_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Verify that the current user has admin privileges.
    """
    if current_user.role not in ["admin", "administrator"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return current_user


async def verify_site_ownership(
    user: User = Depends(get_current_user),
    site_id: int = None,
    db: Session = Depends(get_db),
) -> dict:
    """
    Verify that the current user owns/manages the specified site.
    Returns the site object if authorized.
    """
    if site_id is None:
        raise HTTPException(status_code=400, detail="site_id is required")

    from app.database.models import ConstructionSite

    site = (
        db.query(ConstructionSite)
        .filter(
            ConstructionSite.id == site_id,
            ConstructionSite.user_id == user.id,
        )
        .first()
    )

    if not site:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this site",
        )

    return site


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
