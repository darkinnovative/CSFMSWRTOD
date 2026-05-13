"""
Routes for vehicle tracking endpoints - scoped to construction sites.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from datetime import datetime
from typing import List

from app.database.database import get_db
from app.database.models import Vehicle, ConstructionSite, User
from app.schemas.vehicles import (
    VehicleCreate,
    VehicleResponse,
    VehicleUpdate,
    VehicleLocationUpdate,
)
from app.auth import get_current_user

router = APIRouter(prefix="/api", tags=["vehicles"])


def _verify_site_access(
    site_id: int, user: User, db: Session
) -> ConstructionSite:
    """Helper to verify user has access to site."""
    site = db.query(ConstructionSite).filter(
        ConstructionSite.id == site_id,
        ConstructionSite.user_id == user.id
    ).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return site


# Site-scoped vehicle endpoints (recommended pattern)
@router.post("/sites/{site_id}/vehicles", response_model=VehicleResponse)
async def create_vehicle_for_site(
    site_id: int,
    vehicle_data: VehicleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new vehicle for a specific site."""
    site = _verify_site_access(site_id, current_user, db)
    
    vehicle = Vehicle(
        **vehicle_data.dict(),
        site_id=site_id,
        company_id=site.company_id
    )
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.get("/sites/{site_id}/vehicles", response_model=List[VehicleResponse])
async def get_site_vehicles(
    site_id: int,
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all vehicles for a specific site."""
    site = _verify_site_access(site_id, current_user, db)
    
    query = db.query(Vehicle).filter(Vehicle.site_id == site_id)
    
    if status:
        query = query.filter(Vehicle.status == status)
    
    vehicles = query.offset(skip).limit(limit).all()
    return vehicles


@router.get("/sites/{site_id}/vehicles/{vehicle_id}", response_model=VehicleResponse)
async def get_vehicle(
    site_id: int,
    vehicle_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific vehicle details for a site."""
    site = _verify_site_access(site_id, current_user, db)
    
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.site_id == site_id
    ).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


@router.put("/sites/{site_id}/vehicles/{vehicle_id}", response_model=VehicleResponse)
async def update_vehicle(
    site_id: int,
    vehicle_id: int,
    vehicle_data: VehicleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update vehicle information."""
    site = _verify_site_access(site_id, current_user, db)
    
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.site_id == site_id
    ).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    for key, value in vehicle_data.dict(exclude_unset=True).items():
        setattr(vehicle, key, value)
    
    vehicle.last_updated = datetime.utcnow()
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.delete("/sites/{site_id}/vehicles/{vehicle_id}")
async def delete_vehicle(
    site_id: int,
    vehicle_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a vehicle from a site."""
    site = _verify_site_access(site_id, current_user, db)
    
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.site_id == site_id
    ).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    db.delete(vehicle)
    db.commit()
    return {"message": "Vehicle deleted successfully"}


@router.post("/sites/{site_id}/vehicles/{vehicle_id}/location")
async def update_vehicle_location(
    site_id: int,
    vehicle_id: int,
    location_data: VehicleLocationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update vehicle location."""
    site = _verify_site_access(site_id, current_user, db)
    
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.site_id == site_id
    ).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    vehicle.latitude = location_data.latitude
    vehicle.longitude = location_data.longitude
    vehicle.speed = location_data.speed
    vehicle.status = location_data.status
    vehicle.last_updated = datetime.utcnow()
    
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.get("/sites/{site_id}/vehicles/active", response_model=List[VehicleResponse])
async def get_active_vehicles_for_site(
    site_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all active vehicles for a specific site."""
    site = _verify_site_access(site_id, current_user, db)
    
    vehicles = (
        db.query(Vehicle)
        .filter(Vehicle.site_id == site_id, Vehicle.status == "active")
        .all()
    )
    return vehicles
