"""
Routes for quotation management endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from datetime import datetime
from typing import List
import os
import shutil

from app.database.database import get_db
from app.database.models import Quotation, User
from app.schemas.quotations import (
    QuotationCreate,
    QuotationResponse,
    QuotationUpdate,
    QuotationApprove,
    QuotationReject,
    QuotationStatsResponse,
)
from app.auth import get_current_user, verify_admin

router = APIRouter(prefix="/api/quotations", tags=["quotations"])


@router.post("/", response_model=QuotationResponse)
async def create_quotation(
    quotation_data: QuotationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new quotation for user's company.
    
    Parameters:
    - quotation_data: Quotation data (company_id and valid_until are optional)
    - current_user: Authenticated user (injected via JWT token)
    - db: Database session
    
    Returns:
    - QuotationResponse: Created quotation with all fields
    
    Required Headers:
    - Authorization: Bearer <JWT_TOKEN>
    
    Request Body:
    {
        "project_name": "string",
        "state": "string",
        "city": "string",
        "pincode": "string",
        "landmark": "string",
        "client_name": "string",
        "client_email": "string",
        "entry_gates": 2,
        "required_cameras": 4,
        "land_area": 1000.5,
        "duration_days": 30,
        "budget_amount": 50000.0,
        "project_type": "string",
        "has_promotional_clips": false,
        "project_design_file": "string",
        "map_url": "string"
    }
    """
    # Auto-set company_id, created_by and valid_until if not provided
    quotation_dict = quotation_data.dict()
    quotation_dict['company_id'] = current_user.company_id
    quotation_dict['created_by'] = current_user.id  # Track which user created it
    
    # Set default valid_until to 30 days from now if not provided
    if not quotation_dict.get('valid_until'):
        from datetime import datetime, timedelta
        quotation_dict['valid_until'] = datetime.utcnow() + timedelta(days=30)
    
    quotation = Quotation(**quotation_dict)
    db.add(quotation)
    db.commit()
    db.refresh(quotation)
    return quotation


@router.get("/", response_model=List[QuotationResponse])
async def get_quotations(
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    user_id: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get quotations. Admins can see all, users see their own, or specific user_id if provided."""
    # If user_id parameter is provided, filter by that user (for admin use)
    if user_id and current_user.role in ["admin", "administrator"]:
        target_user_id = int(user_id)
    else:
        target_user_id = current_user.id  # Default to current user
    
    query = db.query(Quotation).filter(
        Quotation.company_id == current_user.company_id,
        Quotation.created_by == target_user_id
    ).order_by(desc(Quotation.created_date))
    
    if status:
        query = query.filter(Quotation.status == status)
    
    quotations = query.offset(skip).limit(limit).all()
    return quotations


@router.get("/{quotation_id}", response_model=QuotationResponse)
async def get_quotation(
    quotation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific quotation details."""
    quotation = db.query(Quotation).filter(
        Quotation.id == quotation_id,
        Quotation.company_id == current_user.company_id
    ).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return quotation


@router.put("/{quotation_id}", response_model=QuotationResponse)
async def update_quotation(
    quotation_id: int,
    quotation_data: QuotationUpdate,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Update quotation information. Admin only."""
    quotation = db.query(Quotation).filter(
        Quotation.id == quotation_id,
        Quotation.company_id == admin_user.company_id
    ).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    for key, value in quotation_data.dict(exclude_unset=True).items():
        setattr(quotation, key, value)
    
    db.commit()
    db.refresh(quotation)
    return quotation


@router.post("/{quotation_id}/approve", response_model=QuotationResponse)
async def approve_quotation(
    quotation_id: int,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Approve a quotation. Admin only."""
    quotation = db.query(Quotation).filter(
        Quotation.id == quotation_id,
        Quotation.company_id == admin_user.company_id
    ).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    quotation.status = "approved"
    db.commit()
    db.refresh(quotation)
    return quotation


@router.post("/{quotation_id}/reject", response_model=QuotationResponse)
async def reject_quotation(
    quotation_id: int,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Reject a quotation. Admin only."""
    quotation = db.query(Quotation).filter(
        Quotation.id == quotation_id,
        Quotation.company_id == admin_user.company_id
    ).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    quotation.status = "rejected"
    db.commit()
    db.refresh(quotation)
    return quotation


@router.delete("/{quotation_id}")
async def delete_quotation(
    quotation_id: int,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """Delete a quotation. Admin only."""
    quotation = db.query(Quotation).filter(
        Quotation.id == quotation_id,
        Quotation.company_id == admin_user.company_id
    ).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    db.delete(quotation)
    db.commit()
    return {"message": "Quotation deleted successfully"}


@router.post("/{quotation_id}/upload-design")
async def upload_project_design(
    quotation_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload project design file (PDF or JPG) for a quotation."""
    quotation = db.query(Quotation).filter(
        Quotation.id == quotation_id,
        Quotation.company_id == current_user.company_id
    ).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    # Validate file type
    allowed_types = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, JPG, and PNG files are allowed"
        )
    
    # Create uploads directory if it doesn't exist
    upload_dir = "uploads/quotations"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate filename with quotation_id
    file_ext = file.filename.split(".")[-1]
    filename = f"quotation_{quotation_id}_design.{file_ext}"
    file_path = f"{upload_dir}/{filename}"
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update quotation with file path
    quotation.project_design_file = file_path
    db.commit()
    db.refresh(quotation)
    
    return {
        "message": "File uploaded successfully",
        "file_path": file_path,
        "quotation": quotation
    }


@router.get("/stats", response_model=QuotationStatsResponse)
async def get_quotation_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get quotation statistics for current user's company."""
    total = db.query(func.count(Quotation.id)).filter(
        Quotation.company_id == current_user.company_id
    ).scalar() or 0
    pending = db.query(func.count(Quotation.id)).filter(
        Quotation.company_id == current_user.company_id, Quotation.status == "pending"
    ).scalar() or 0
    approved = db.query(func.count(Quotation.id)).filter(
        Quotation.company_id == current_user.company_id, Quotation.status == "approved"
    ).scalar() or 0
    rejected = db.query(func.count(Quotation.id)).filter(
        Quotation.company_id == current_user.company_id, Quotation.status == "rejected"
    ).scalar() or 0
    total_value = db.query(func.sum(Quotation.budget_amount)).filter(
        Quotation.company_id == current_user.company_id
    ).scalar() or 0.0
    
    return QuotationStatsResponse(
        total_quotations=total,
        pending=pending,
        approved=approved,
        rejected=rejected,
        total_value=float(total_value),
    )
