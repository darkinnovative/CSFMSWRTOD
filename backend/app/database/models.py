"""
Database models for Dark Innovative - Construction & Fleet Management System.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):
    """User authentication model."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    full_name = Column(String(100))
    role = Column(String(50), default="user")  # admin, user
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    class Config:
        from_attributes = True


class ContactMessage(Base):
    """Contact message model for storing user inquiries."""
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Nullable for guest messages
    name = Column(String(100))
    email = Column(String(100))
    subject = Column(String(255))
    message = Column(String(1000))
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    class Config:
        from_attributes = True


class Company(Base):
    """Company model."""
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True)
    description = Column(String(1000))
    address = Column(String(255))
    phone = Column(String(20))
    email = Column(String(100))
    website = Column(String(255))
    logo_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    class Config:
        from_attributes = True


class ConstructionSite(Base):
    """Construction site model."""
    __tablename__ = "construction_sites"

    id = Column(Integer, primary_key=True, index=True)
    site_name = Column(String(255), index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    user_id = Column(Integer, ForeignKey("users.id"))  # Site belongs to a user
    site_order = Column(Integer, default=0)  # Order for site selection
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(String(50), default="active")  # active, paused, completed
    start_date = Column(DateTime)
    expected_end_date = Column(DateTime)
    manager_name = Column(String(100))
    manager_phone = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)

    class Config:
        from_attributes = True


class Vehicle(Base):
    """Vehicle tracking model."""
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    site_id = Column(Integer, ForeignKey("construction_sites.id"), nullable=True)
    registration_number = Column(String(50), unique=True, index=True)
    vehicle_type = Column(String(50))  # car, truck, bus
    driver_name = Column(String(100))
    driver_phone = Column(String(20))
    status = Column(String(50), default="parked")  # active, parked, maintenance
    latitude = Column(Float, default=0.0)
    longitude = Column(Float, default=0.0)
    speed = Column(Float, default=0.0)
    last_updated = Column(DateTime, default=datetime.utcnow)

    class Config:
        from_attributes = True


class GatePass(Base):
    """Gate pass model for vehicle entry/exit."""
    __tablename__ = "gate_passes"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    site_id = Column(Integer, ForeignKey("construction_sites.id"))
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    pass_number = Column(String(50), unique=True, index=True)
    entry_time = Column(DateTime, default=datetime.utcnow)
    exit_time = Column(DateTime, nullable=True)
    gate_name = Column(String(100))
    pass_type = Column(String(50))  # daily, weekly, monthly
    valid_until = Column(DateTime)
    is_valid = Column(Boolean, default=True)

    class Config:
        from_attributes = True


class Employee(Base):
    """Employee tracking model."""
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    site_id = Column(Integer, ForeignKey("construction_sites.id"), nullable=True)
    employee_id = Column(String(50), unique=True, index=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    email = Column(String(100))
    phone = Column(String(20))
    position = Column(String(100))
    department = Column(String(100))
    check_in_time = Column(DateTime, nullable=True)
    check_out_time = Column(DateTime, nullable=True)
    status = Column(String(50), default="checked_out")  # checked_in, checked_out
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    class Config:
        from_attributes = True


class TrafficVehicle(Base):
    """Traffic vehicle monitoring model."""
    __tablename__ = "traffic_vehicles"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    site_id = Column(Integer, ForeignKey("construction_sites.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    vehicle_count = Column(Integer)
    vehicle_types = Column(String(255))  # JSON string of vehicle counts
    congestion_level = Column(String(50))  # low, medium, high
    average_speed = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    camera_location = Column(String(100))

    class Config:
        from_attributes = True


class DetectionEvent(Base):
    """Original detection event model (for compatibility)."""
    __tablename__ = "detection_events"

    id = Column(Integer, primary_key=True, index=True)
    object_type = Column(String(100), index=True)
    confidence = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    image_path = Column(String(255))
    device_id = Column(String(100), index=True)
    site_id = Column(Integer, ForeignKey("construction_sites.id"), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)

    class Config:
        from_attributes = True


class DeviceStatus(Base):
    """Device status model."""
    __tablename__ = "device_status"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String(100), unique=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    site_id = Column(Integer, ForeignKey("construction_sites.id"), nullable=True)
    last_heartbeat = Column(DateTime, default=datetime.utcnow)
    fps = Column(Float, default=0.0)
    cpu_usage = Column(Float, default=0.0)
    memory_usage = Column(Float, default=0.0)
    model_type = Column(String(50), default="yolov5n")
    is_online = Column(Boolean, default=True)

    class Config:
        from_attributes = True


class Quotation(Base):
    """Quotation model for projects."""
    __tablename__ = "quotations"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_by = Column(Integer, ForeignKey("users.id"))  # Track which user created it
    project_name = Column(String(255), index=True)
    state = Column(String(100))
    city = Column(String(100))
    pincode = Column(String(20))
    landmark = Column(String(255), nullable=True)
    client_name = Column(String(100))
    client_email = Column(String(100))
    entry_gates = Column(Integer, default=0)
    required_cameras = Column(Integer, default=0)
    land_area = Column(Float, default=0.0)
    duration_days = Column(Integer, default=0)
    map_url = Column(String(500), nullable=True)
    has_promotional_clips = Column(Boolean, default=False)  # Yes/No option
    project_design_file = Column(String(500), nullable=True)  # PDF or JPG file path
    budget_amount = Column(Float, default=0.0)
    project_type = Column(String(50))  # Residential, Commercial, Industrial, Infrastructure
    status = Column(String(50), default="pending")  # pending, approved, rejected
    created_date = Column(DateTime, default=datetime.utcnow)
    valid_until = Column(DateTime)

    class Config:
        from_attributes = True


class Order(Base):
    """Order model for confirmed projects."""
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    quotation_id = Column(Integer, ForeignKey("quotations.id"), nullable=True)
    client_name = Column(String(100))
    amount = Column(Float)
    scope = Column(String(500))
    status = Column(String(50), default="processing")  # processing, shipped, delivered, cancelled
    order_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    class Config:
        from_attributes = True

