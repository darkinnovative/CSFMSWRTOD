"""
Pydantic schemas for detection events.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class DetectionCreate(BaseModel):
    """Schema for creating a detection event."""
    object_type: str = Field(..., min_length=1, max_length=100)
    confidence: float = Field(..., ge=0.0, le=1.0)
    device_id: str = Field(default="pi-default")
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class DetectionResponse(BaseModel):
    """Schema for detection event response."""
    id: int
    object_type: str
    confidence: float
    timestamp: datetime
    image_path: str
    device_id: str
    latitude: Optional[float]
    longitude: Optional[float]

    class Config:
        from_attributes = True


class DetectionStats(BaseModel):
    """Schema for detection statistics."""
    total_detections: int
    detections_today: int
    unique_objects: int
    average_confidence: float
    last_detection: Optional[datetime]


class BulkDetectionCreate(BaseModel):
    """Schema for bulk detection uploads."""
    detections: list[DetectionCreate]
    device_id: str


class DeviceStatusUpdate(BaseModel):
    """Schema for device status updates."""
    device_id: str
    fps: float = Field(default=0.0, ge=0.0)
    cpu_usage: float = Field(default=0.0, ge=0.0, le=100.0)
    memory_usage: float = Field(default=0.0, ge=0.0, le=100.0)
    model_type: str = "yolov5n"
