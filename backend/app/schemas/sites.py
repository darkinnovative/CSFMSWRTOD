"""
Schemas for site/construction site endpoints.
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ConstructionSiteBase(BaseModel):
    site_name: str
    site_order: int = 0
    latitude: float
    longitude: float
    status: str = "active"
    start_date: datetime
    expected_end_date: datetime
    manager_name: str
    manager_phone: str


class ConstructionSiteCreate(ConstructionSiteBase):
    company_id: int


class ConstructionSiteUpdate(BaseModel):
    site_name: Optional[str] = None
    site_order: Optional[int] = None
    status: Optional[str] = None
    manager_name: Optional[str] = None
    manager_phone: Optional[str] = None


class ConstructionSiteResponse(ConstructionSiteBase):
    id: int
    company_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SiteStatsResponse(BaseModel):
    total_sites: int
    active_sites: int
    paused_sites: int
    completed_sites: int
    total_cameras: int
