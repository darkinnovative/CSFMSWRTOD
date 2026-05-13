"""
Schemas for quotation endpoints.
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class QuotationBase(BaseModel):
    project_name: str
    state: str
    city: str
    pincode: str
    landmark: Optional[str] = None
    client_name: str
    client_email: str
    entry_gates: int
    required_cameras: int
    land_area: float
    duration_days: int
    budget_amount: float
    project_type: str
    has_promotional_clips: bool = False  # Yes/No option
    project_design_file: Optional[str] = None  # PDF or JPG


class QuotationCreate(QuotationBase):
    map_url: Optional[str] = None
    has_promotional_clips: bool = False
    project_design_file: Optional[str] = None  # PDF or JPG
    valid_until: datetime


class QuotationUpdate(BaseModel):
    status: Optional[str] = None
    budget_amount: Optional[float] = None
    valid_until: Optional[datetime] = None


class QuotationApprove(BaseModel):
    status: str = "approved"


class QuotationReject(BaseModel):
    status: str = "rejected"


class QuotationResponse(QuotationBase):
    id: int
    company_id: int
    created_by: Optional[int]
    map_url: Optional[str]
    has_promotional_clips: bool
    project_design_file: Optional[str]
    status: str
    created_date: datetime
    valid_until: datetime

    class Config:
        from_attributes = True


class QuotationStatsResponse(BaseModel):
    total_quotations: int
    pending: int
    approved: int
    rejected: int
    total_value: float
