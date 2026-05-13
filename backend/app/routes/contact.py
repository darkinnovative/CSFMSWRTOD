"""
Routes for contact message endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime

from app.database.database import get_db
from app.database.models import ContactMessage, User
from app.schemas.contact import ContactMessageCreate, ContactMessageResponse, ContactMessageWithUserResponse, UserDetailResponse
from app.auth import verify_admin, get_current_user

router = APIRouter(prefix="/api/contact", tags=["contact"])

async def get_optional_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """
    Extract user from token if provided, but don't raise exception for anonymous users.
    This allows both authenticated and anonymous contact submissions.
    """
    if not authorization:
        return None
    
    try:
        # Parse authorization header
        parts = authorization.split()
        if len(parts) != 2:
            return None
        
        scheme, token = parts
        if scheme.lower() != "bearer":
            return None
            
        # Validate token
        from app.auth import SECRET_KEY, ALGORITHM
        from jose import JWTError, jwt
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            return None
        user_id: int = int(user_id_str)
            
        # Get user from database
        user = db.query(User).filter(User.id == user_id).first()
        return user
        
    except (JWTError, ValueError):
        return None

@router.post("/", response_model=ContactMessageResponse)
async def create_contact_message(
    message_data: ContactMessageCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """Submit a contact message."""
    # If user is authenticated, link the message to their account
    user_id = current_user.id if current_user else None
    
    # If authenticated, use user's actual email and name if not provided
    email = message_data.email
    name = message_data.name
    if current_user:
        if not email:
            email = current_user.email
        if not name:
            name = current_user.full_name
    
    message = ContactMessage(
        user_id=user_id,
        name=name,
        email=email,
        subject=message_data.subject,
        message=message_data.message,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("/", response_model=List[ContactMessageWithUserResponse])
async def get_contact_messages(
    skip: int = 0,
    limit: int = 100,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Get all contact messages. Admin only."""
    messages = db.query(ContactMessage).order_by(desc(ContactMessage.created_at)).offset(skip).limit(limit).all()
    
    response = []
    for msg in messages:
        user_detail = None
        if msg.user_id:
            user = db.query(User).filter(User.id == msg.user_id).first()
            if user:
                user_detail = UserDetailResponse(
                    id=user.id,
                    full_name=user.full_name,
                    email=user.email,
                    role=user.role
                )
        
        response.append(ContactMessageWithUserResponse(
            id=msg.id,
            name=msg.name,
            email=msg.email,
            subject=msg.subject,
            message=msg.message,
            is_read=msg.is_read,
            created_at=msg.created_at,
            user_id=msg.user_id,
            user=user_detail
        ))
    return response


@router.put("/{message_id}/read", response_model=ContactMessageResponse)
async def mark_message_read(
    message_id: int,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Mark a contact message as read. Admin only."""
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.is_read = True
    db.commit()
    db.refresh(message)
    return message
