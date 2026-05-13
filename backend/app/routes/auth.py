"""
Authentication routes for user login, registration, and token management.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import os
import re
import asyncio
from dotenv import load_dotenv

from app.database.database import get_db
from app.database.models import User, Company
from app.schemas.auth import LoginRequest, UserCreate, TokenResponse, UserResponse
from app.auth import create_access_token, get_current_user

load_dotenv()

router = APIRouter(prefix="/auth", tags=["authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


def validate_password_strength(password: str) -> bool:
    """Check if password meets complexity requirements."""
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True


@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check password strength
    if not validate_password_strength(user_data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        )

    # Check if there's an existing user
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists",
        )
    
    # Check if this is the first user in the system
    existing_users_count = db.query(User).count()
    is_first_user = existing_users_count == 0
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Check if there's an existing company, if not create one
    existing_company = db.query(Company).first()
    if existing_company:
        # Use existing company for new user
        company = existing_company
    else:
        # Create new company with unique name
        company_name = f"{user_data.full_name}'s Company"
        counter = 1
        while db.query(Company).filter(Company.name == company_name).first():
            company_name = f"{user_data.full_name}'s Company ({counter})"
            counter += 1
            
        company = Company(
            name=company_name,
            description="Default company",
            email=user_data.email,
        )
        db.add(company)
        db.flush()  # Get company ID without committing
    
    # Create user
    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        role="administrator" if is_first_user else "admin",  # First user is administrator, subsequent are admin
        company_id=company.id,
        is_active=True,
    )
    
    print(f"[AUTH INFO] Created user: {user_data.email} with role: {'administrator' if is_first_user else 'admin'}")
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            role=user.role,
            company_id=user.company_id,
            is_active=user.is_active,
        ),
    }


@router.post("/login", response_model=TokenResponse)
async def login(request: Request, login_data: LoginRequest, db: Session = Depends(get_db)):
    """User login endpoint."""
    # Find user by email
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        # Add a slight delay to prevent timing attacks and slow down brute force
        await asyncio.sleep(1)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            role=user.role,
            company_id=user.company_id,
            is_active=user.is_active,
        ),
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
):
    """Get current user information (requires valid auth token)."""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        role=current_user.role,
        company_id=current_user.company_id,
        is_active=current_user.is_active,
    )


@router.post("/logout")
async def logout():
    """Logout endpoint (token is invalidated on frontend)."""
    return {"message": "Logged out successfully"}


@router.get("/debug/test-auth")
async def test_auth(
    current_user: User = Depends(get_current_user),
):
    """Debug endpoint to test if authentication is working properly."""
    return {
        "status": "success",
        "message": "Authentication is working!",
        "user_id": current_user.id,
        "user_email": current_user.email,
        "user_company_id": current_user.company_id,
    }


# Demo user setup
def setup_demo_user(db: Session):
    """Create a demo user for testing."""
    existing_user = db.query(User).filter(User.email == "admin@darkinnovative.com").first()
    
    if not existing_user:
        print("[DEMO SETUP] Creating main administrator user...")
        
        # Create demo company
        demo_company = Company(
            name="Dark Innovative Demo",
            description="Demo company for testing",
            address="123 Tech Street, San Francisco, CA",
            phone="+1-800-DEMO-123",
            email="info@darkinnovative.com",
            website="https://darkinnovative.com",
        )
        db.add(demo_company)
        db.flush()
        
        # Create demo user
        hashed_password = get_password_hash("password")
        demo_user = User(
            username="admin",
            email="admin@darkinnovative.com",
            hashed_password=hashed_password,
            full_name="Demo Admin",
            role="administrator",
            company_id=demo_company.id,
            is_active=True,
        )
        db.add(demo_user)
        db.commit()
        
        print("[DEMO SETUP] Main administrator user created successfully!")
        print(f"[DEMO SETUP] Email: admin@darkinnovative.com")
        print(f"[DEMO SETUP] Password: password")
        print(f"[DEMO SETUP] Role: admin")
        print(f"[DEMO SETUP] Company ID: {demo_company.id}")
    else:
        print("[DEMO SETUP] Main administrator user already exists")
