"""
Schemas for employee tracking endpoints.
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    position: str
    department: str


class EmployeeCreate(EmployeeBase):
    company_id: int
    site_id: Optional[int] = None
    employee_id: str


class EmployeeUpdate(BaseModel):
    position: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None


class EmployeeCheckIn(BaseModel):
    check_in_time: datetime
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class EmployeeCheckOut(BaseModel):
    check_out_time: datetime
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class EmployeeResponse(EmployeeBase):
    id: int
    company_id: int
    site_id: Optional[int]
    employee_id: str
    check_in_time: Optional[datetime]
    check_out_time: Optional[datetime]
    status: str
    latitude: Optional[float]
    longitude: Optional[float]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AttendanceStatsResponse(BaseModel):
    total_employees: int
    checked_in: int
    checked_out: int
    absent: int
