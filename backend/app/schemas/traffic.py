"""
Schemas for traffic and gate pass endpoints.
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class GatePassBase(BaseModel):
    pass_number: str
    gate_name: str
    pass_type: str
    valid_until: datetime


class GatePassCreate(GatePassBase):
    company_id: int
    site_id: int
    vehicle_id: int


class GatePassResponse(GatePassBase):
    id: int
    company_id: int
    site_id: int
    vehicle_id: int
    entry_time: datetime
    exit_time: Optional[datetime]
    is_valid: bool

    class Config:
        from_attributes = True


class TrafficVehicleCreate(BaseModel):
    company_id: int
    site_id: Optional[int] = None
    vehicle_count: int
    vehicle_types: str
    congestion_level: str
    average_speed: float
    latitude: float
    longitude: float
    camera_location: str


class TrafficVehicleResponse(BaseModel):
    id: int
    company_id: int
    site_id: Optional[int]
    timestamp: datetime
    vehicle_count: int
    vehicle_types: str
    congestion_level: str
    average_speed: float
    latitude: float
    longitude: float
    camera_location: str

    class Config:
        from_attributes = True


class TrafficStatsResponse(BaseModel):
    total_vehicles_today: int
    average_congestion: str
    peak_hour_count: int
    total_gate_passes: int
