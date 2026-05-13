"""
Routes for construction site management endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from datetime import datetime
from typing import List

from app.database.database import get_db
from app.database.models import ConstructionSite, DetectionEvent, User
from app.schemas.sites import (
    ConstructionSiteCreate,
    ConstructionSiteResponse,
    ConstructionSiteUpdate,
    SiteStatsResponse,
)
from app.auth import get_current_user

router = APIRouter(prefix="/api/sites", tags=["sites"])


@router.post("/", response_model=ConstructionSiteResponse)
async def create_site(
    site_data: ConstructionSiteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new construction site for the current user.
    
    Parameters:
    - site_data: Construction site data including site_name, site_order, etc.
    - current_user: Authenticated user (injected via JWT token)
    - db: Database session
    
    Returns:
    - ConstructionSiteResponse: Created site with all fields
    
    Required Headers:
    - Authorization: Bearer <JWT_TOKEN>
    
    Request Body:
    {
        "site_name": "string",
        "site_order": 0,
        "latitude": 0.0,
        "longitude": 0.0,
        "status": "active",
        "start_date": "2024-01-01T00:00:00",
        "expected_end_date": "2024-12-31T00:00:00",
        "manager_name": "string",
        "manager_phone": "string"
    }
    """
    # Get the highest current order for this user
    max_order = db.query(ConstructionSite).filter(
        ConstructionSite.user_id == current_user.id
    ).order_by(ConstructionSite.site_order.desc()).first()
    
    next_order = (max_order.site_order + 1) if max_order and max_order.site_order else 0
    
    site = ConstructionSite(
        **site_data.dict(),
        user_id=current_user.id,
        company_id=current_user.company_id,
        site_order=site_data.site_order if site_data.site_order is not None else next_order
    )
    db.add(site)
    db.commit()
    db.refresh(site)
    return site


@router.get("/", response_model=List[ConstructionSiteResponse])
async def get_sites(
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all construction sites for the current user, ordered by site_order."""
    query = db.query(ConstructionSite).filter(
        ConstructionSite.user_id == current_user.id
    )
    
    if status:
        query = query.filter(ConstructionSite.status == status)
    
    sites = query.order_by(ConstructionSite.site_order.asc()).offset(skip).limit(limit).all()
    return sites


@router.get("/{site_id}", response_model=ConstructionSiteResponse)
async def get_site(
    site_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific site details (user must own the site)."""
    site = db.query(ConstructionSite).filter(
        ConstructionSite.id == site_id,
        ConstructionSite.user_id == current_user.id
    ).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return site


@router.put("/{site_id}", response_model=ConstructionSiteResponse)
async def update_site(
    site_id: int,
    site_data: ConstructionSiteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update site information (user must own the site)."""
    site = db.query(ConstructionSite).filter(
        ConstructionSite.id == site_id,
        ConstructionSite.user_id == current_user.id
    ).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    
    for key, value in site_data.dict(exclude_unset=True).items():
        setattr(site, key, value)
    
    db.commit()
    db.refresh(site)
    return site


@router.delete("/{site_id}")
async def delete_site(
    site_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a construction site (user must own the site)."""
    site = db.query(ConstructionSite).filter(
        ConstructionSite.id == site_id,
        ConstructionSite.user_id == current_user.id
    ).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    
    db.delete(site)
    db.commit()
    return {"message": "Site deleted successfully"}


@router.get("/{site_id}/stats", response_model=SiteStatsResponse)
async def get_site_stats(
    site_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get statistics for a specific site (user must own the site)."""
    site = db.query(ConstructionSite).filter(
        ConstructionSite.id == site_id,
        ConstructionSite.user_id == current_user.id
    ).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    
    total_sites = db.query(func.count(ConstructionSite.id)).filter(
        ConstructionSite.user_id == current_user.id
    ).scalar() or 0
    active_sites = db.query(func.count(ConstructionSite.id)).filter(
        ConstructionSite.user_id == current_user.id,
        ConstructionSite.status == "active"
    ).scalar() or 0
    paused_sites = db.query(func.count(ConstructionSite.id)).filter(
        ConstructionSite.user_id == current_user.id,
        ConstructionSite.status == "paused"
    ).scalar() or 0
    completed_sites = db.query(func.count(ConstructionSite.id)).filter(
        ConstructionSite.user_id == current_user.id,
        ConstructionSite.status == "completed"
    ).scalar() or 0
    
    total_cameras = db.query(func.count(DetectionEvent.id)).filter(
        DetectionEvent.site_id == site_id
    ).scalar() or 0
    
    return SiteStatsResponse(
        total_sites=total_sites,
        active_sites=active_sites,
        paused_sites=paused_sites,
        completed_sites=completed_sites,
        total_cameras=total_cameras,
    )


@router.post("/{site_id}/reorder")
async def reorder_site(
    site_id: int,
    new_order: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Reorder a site to a new position."""
    site = db.query(ConstructionSite).filter(
        ConstructionSite.id == site_id,
        ConstructionSite.user_id == current_user.id
    ).first()
    
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    
    site.site_order = new_order
    db.commit()
    return {"message": "Site reordered successfully"}


@router.get("/{site_id}/detections", response_model=list)
async def get_site_detections(
    site_id: int,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Get all detections for a specific site."""
    detections = (
        db.query(DetectionEvent)
        .filter(DetectionEvent.site_id == site_id)
        .order_by(desc(DetectionEvent.timestamp))
        .limit(limit)
        .all()
    )
    return detections
