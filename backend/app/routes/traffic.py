"""
Routes for traffic and gate pass management endpoints - scoped to sites.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from datetime import datetime
from typing import List

from app.database.database import get_db
from app.database.models import GatePass, TrafficVehicle, ConstructionSite, User
from app.schemas.traffic import (
    GatePassCreate,
    GatePassResponse,
    TrafficVehicleCreate,
    TrafficVehicleResponse,
    TrafficStatsResponse,
)
from app.auth import get_current_user

router = APIRouter(prefix="/api", tags=["traffic"])


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


@router.post("/sites/{site_id}/gate-passes", response_model=GatePassResponse)
async def create_gate_pass(
    site_id: int,
    pass_data: GatePassCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new gate pass for a site."""
    site = _verify_site_access(site_id, current_user, db)
    
    gate_pass = GatePass(
        **pass_data.dict(),
        site_id=site_id,
        company_id=site.company_id
    )
    db.add(gate_pass)
    db.commit()
    db.refresh(gate_pass)
    return gate_pass


@router.get("/sites/{site_id}/gate-passes", response_model=List[GatePassResponse])
async def get_gate_passes(
    site_id: int,
    is_valid: bool = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all gate passes for a site."""
    site = _verify_site_access(site_id, current_user, db)
    
    query = db.query(GatePass).filter(GatePass.site_id == site_id)
    
    if is_valid is not None:
        query = query.filter(GatePass.is_valid == is_valid)
    
    passes = query.offset(skip).limit(limit).all()
    return passes


@router.get("/sites/{site_id}/gate-passes/{pass_id}", response_model=GatePassResponse)
async def get_gate_pass(
    site_id: int,
    pass_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific gate pass details."""
    site = _verify_site_access(site_id, current_user, db)
    
    gate_pass = db.query(GatePass).filter(
        GatePass.id == pass_id,
        GatePass.site_id == site_id
    ).first()
    if not gate_pass:
        raise HTTPException(status_code=404, detail="Gate pass not found")
    return gate_pass


@router.post("/sites/{site_id}/gate-passes/{pass_id}/exit")
async def record_exit(
    site_id: int,
    pass_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Record vehicle exit time."""
    site = _verify_site_access(site_id, current_user, db)
    
    gate_pass = db.query(GatePass).filter(
        GatePass.id == pass_id,
        GatePass.site_id == site_id
    ).first()
    if not gate_pass:
        raise HTTPException(status_code=404, detail="Gate pass not found")
    
    gate_pass.exit_time = datetime.utcnow()
    db.commit()
    db.refresh(gate_pass)
    return gate_pass


@router.post("/sites/{site_id}/traffic/record")
async def record_traffic_vehicle(
    site_id: int,
    traffic_data: TrafficVehicleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Record traffic vehicle detection."""
    site = _verify_site_access(site_id, current_user, db)
    
    traffic = TrafficVehicle(
        **traffic_data.dict(),
        site_id=site_id,
        company_id=site.company_id
    )
    db.add(traffic)
    db.commit()
    db.refresh(traffic)
    return traffic


@router.get("/sites/{site_id}/traffic", response_model=List[TrafficVehicleResponse])
async def get_traffic_vehicles(
    site_id: int,
    congestion_level: str = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get traffic vehicle records for a site."""
    site = _verify_site_access(site_id, current_user, db)
    
    query = db.query(TrafficVehicle).filter(TrafficVehicle.site_id == site_id).order_by(desc(TrafficVehicle.timestamp))
    
    if congestion_level:
        query = query.filter(TrafficVehicle.congestion_level == congestion_level)
    
    traffic = query.offset(skip).limit(limit).all()
    return traffic


@router.get("/sites/{site_id}/traffic/current", response_model=TrafficVehicleResponse)
async def get_current_traffic(
    site_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current traffic status for a site."""
    site = _verify_site_access(site_id, current_user, db)
    
    traffic = (
        db.query(TrafficVehicle)
        .filter(TrafficVehicle.site_id == site_id)
        .order_by(desc(TrafficVehicle.timestamp))
        .first()
    )
    if not traffic:
        raise HTTPException(status_code=404, detail="No traffic data found")
    return traffic


@router.get("/sites/{site_id}/traffic/stats", response_model=TrafficStatsResponse)
async def get_traffic_stats(
    site_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get traffic statistics for a site."""
    site = _verify_site_access(site_id, current_user, db)
    
    today = datetime.utcnow().date()
    
    total_vehicles = (
        db.query(func.sum(TrafficVehicle.vehicle_count))
        .filter(TrafficVehicle.site_id == site_id, func.date(TrafficVehicle.timestamp) == today)
        .scalar()
    ) or 0
    
    avg_congestion_data = db.query(func.count(TrafficVehicle.id)).filter(
        TrafficVehicle.site_id == site_id, TrafficVehicle.congestion_level == "high"
    ).scalar() or 0
    
    peak_hour = (
        db.query(func.max(TrafficVehicle.vehicle_count))
        .filter(TrafficVehicle.site_id == site_id)
        .scalar()
    ) or 0
    
    total_gate_passes = db.query(func.count(GatePass.id)).filter(
        GatePass.site_id == site_id
    ).scalar() or 0
    
    return TrafficStatsResponse(
        total_vehicles_today=int(total_vehicles),
        average_congestion="medium",
        peak_hour_count=int(peak_hour),
        total_gate_passes=total_gate_passes,
    )
