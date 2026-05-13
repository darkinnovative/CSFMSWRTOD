"""
Routes for employee tracking endpoints - scoped to construction sites.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from datetime import datetime
from typing import List

from app.database.database import get_db
from app.database.models import Employee, ConstructionSite, User
from app.schemas.employees import (
    EmployeeCreate,
    EmployeeResponse,
    EmployeeUpdate,
    EmployeeCheckIn,
    EmployeeCheckOut,
    AttendanceStatsResponse,
)
from app.auth import get_current_user

router = APIRouter(prefix="/api", tags=["employees"])


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


@router.post("/sites/{site_id}/employees", response_model=EmployeeResponse)
async def create_employee(
    site_id: int,
    employee_data: EmployeeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new employee for a site."""
    site = _verify_site_access(site_id, current_user, db)
    
    employee = Employee(
        **employee_data.dict(),
        site_id=site_id,
        company_id=site.company_id
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.get("/sites/{site_id}/employees", response_model=List[EmployeeResponse])
async def get_employees(
    site_id: int,
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all employees for a site."""
    site = _verify_site_access(site_id, current_user, db)
    
    query = db.query(Employee).filter(Employee.site_id == site_id)
    
    if status:
        query = query.filter(Employee.status == status)

    employees = query.offset(skip).limit(limit).all()
    return employees


@router.get("/sites/{site_id}/employees/{employee_id}", response_model=EmployeeResponse)
async def get_employee(
    site_id: int,
    employee_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific employee details for a site."""
    site = _verify_site_access(site_id, current_user, db)
    
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.site_id == site_id
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.put("/sites/{site_id}/employees/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    site_id: int,
    employee_id: int,
    employee_data: EmployeeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update employee information."""
    site = _verify_site_access(site_id, current_user, db)
    
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.site_id == site_id
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    for key, value in employee_data.dict(exclude_unset=True).items():
        setattr(employee, key, value)
    
    db.commit()
    db.refresh(employee)
    return employee


@router.delete("/sites/{site_id}/employees/{employee_id}")
async def delete_employee(
    site_id: int,
    employee_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an employee."""
    site = _verify_site_access(site_id, current_user, db)
    
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.site_id == site_id
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(employee)
    db.commit()
    return {"message": "Employee deleted successfully"}


@router.post("/sites/{site_id}/employees/{employee_id}/check-in", response_model=EmployeeResponse)
async def check_in_employee(
    site_id: int,
    employee_id: int,
    check_in_data: EmployeeCheckIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Check in an employee."""
    site = _verify_site_access(site_id, current_user, db)
    
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.site_id == site_id
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    employee.check_in_time = check_in_data.check_in_time
    employee.check_out_time = None
    if check_in_data.latitude:
        employee.latitude = check_in_data.latitude
    if check_in_data.longitude:
        employee.longitude = check_in_data.longitude
    employee.status = "checked_in"
    
    db.commit()
    db.refresh(employee)
    return employee


@router.post("/sites/{site_id}/employees/{employee_id}/check-out", response_model=EmployeeResponse)
async def check_out_employee(
    site_id: int,
    employee_id: int,
    check_out_data: EmployeeCheckOut,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Check out an employee."""
    site = _verify_site_access(site_id, current_user, db)
    
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.site_id == site_id
    ).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    employee.check_out_time = check_out_data.check_out_time
    if check_out_data.latitude:
        employee.latitude = check_out_data.latitude
    if check_out_data.longitude:
        employee.longitude = check_out_data.longitude
    employee.status = "checked_out"
    
    db.commit()
    db.refresh(employee)
    return employee


@router.get("/sites/{site_id}/attendance", response_model=AttendanceStatsResponse)
async def get_attendance_stats(
    site_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get attendance statistics for a site."""
    site = _verify_site_access(site_id, current_user, db)
    
    total_employees = db.query(func.count(Employee.id)).filter(
        Employee.site_id == site_id,
        Employee.is_active == True
    ).scalar() or 0
    checked_in = db.query(func.count(Employee.id)).filter(
        Employee.site_id == site_id,
        Employee.status == "checked_in"
    ).scalar() or 0
    checked_out = db.query(func.count(Employee.id)).filter(
        Employee.site_id == site_id,
        Employee.status == "checked_out"
    ).scalar() or 0
    absent = total_employees - checked_in
    
    return AttendanceStatsResponse(
        total_employees=total_employees,
        checked_in=checked_in,
        checked_out=checked_out,
        absent=absent,
    )


@router.get("/sites/{site_id}/on-site", response_model=List[EmployeeResponse])
async def get_on_site_employees(
    site_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all employees currently on site."""
    site = _verify_site_access(site_id, current_user, db)
    
    employees = (
        db.query(Employee)
        .filter(Employee.site_id == site_id, Employee.status == "checked_in")
        .all()
    )
    return employees
