"""
Schemas for vehicle tracking endpoints.
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class VehicleBase(BaseModel):
    registration_number: str
    vehicle_type: str
    driver_name: str
    driver_phone: str
    status: str = "parked"


class VehicleCreate(VehicleBase):
    company_id: int
    site_id: Optional[int] = None


class VehicleUpdate(BaseModel):
    status: Optional[str] = None
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    speed: Optional[float] = None


class VehicleResponse(VehicleBase):
    id: int
    company_id: int
    site_id: Optional[int]
    latitude: float
    longitude: float
    speed: float
    last_updated: datetime

    class Config:
        from_attributes = True


class VehicleLocationUpdate(BaseModel):
    device_id: str
    latitude: float
    longitude: float
    speed: float
    status: str = "active"
