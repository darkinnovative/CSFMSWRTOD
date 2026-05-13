"""
API routes for detection endpoints.
"""
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
import os
import shutil
from pathlib import Path

from app.database.database import get_db
from app.database.models import DetectionEvent, DeviceStatus
from app.schemas.detection import (
    DetectionCreate,
    DetectionResponse,
    DetectionStats,
    BulkDetectionCreate,
    DeviceStatusUpdate,
)

router = APIRouter(prefix="/api", tags=["detections"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/detections", response_model=DetectionResponse)
async def create_detection(
    object_type: str = Form(...),
    confidence: float = Form(...),
    device_id: str = Form(default="pi-default"),
    latitude: float = Form(default=None),
    longitude: float = Form(default=None),
    file: UploadFile = File(default=None),
    db: Session = Depends(get_db),
):
    """
    Create a detection event with optional image upload.
    """
    image_path = None

    # Save uploaded image if provided
    if file:
        # Create device-specific directory
        device_upload_dir = UPLOAD_DIR / device_id
        device_upload_dir.mkdir(exist_ok=True)

        # Save with timestamp
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S_%f")
        file_ext = Path(file.filename).suffix if file.filename else ".jpg"
        filename = f"{object_type}_{timestamp}{file_ext}"
        filepath = device_upload_dir / filename

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        image_path = str(filepath)

    # Create detection event
    detection = DetectionEvent(
        object_type=object_type,
        confidence=confidence,
        device_id=device_id,
        image_path=image_path,
        latitude=latitude,
        longitude=longitude,
    )

    db.add(detection)

    # Update device status
    device_status = db.query(DeviceStatus).filter_by(device_id=device_id).first()
    if not device_status:
        device_status = DeviceStatus(device_id=device_id)
        db.add(device_status)

    device_status.last_heartbeat = datetime.utcnow()
    device_status.is_online = True

    db.commit()
    db.refresh(detection)

    return detection


@router.get("/detections", response_model=List[DetectionResponse])
async def get_detections(
    device_id: str = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    object_type: str = Query(None),
    db: Session = Depends(get_db),
):
    """
    Get detection events with optional filtering.
    """
    query = db.query(DetectionEvent)

    if device_id:
        query = query.filter_by(device_id=device_id)

    if object_type:
        query = query.filter_by(object_type=object_type)

    detections = query.order_by(desc(DetectionEvent.timestamp)).offset(
        offset
    ).limit(limit).all()

    return detections


@router.get("/detections/latest", response_model=List[DetectionResponse])
async def get_latest_detections(
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Get the latest detection events.
    """
    detections = (
        db.query(DetectionEvent)
        .order_by(desc(DetectionEvent.timestamp))
        .limit(limit)
        .all()
    )

    return detections


@router.get("/detections/{detection_id}", response_model=DetectionResponse)
async def get_detection(detection_id: int, db: Session = Depends(get_db)):
    """
    Get a specific detection by ID.
    """
    detection = db.query(DetectionEvent).filter_by(id=detection_id).first()

    if not detection:
        raise HTTPException(status_code=404, detail="Detection not found")

    return detection


@router.get("/stats", response_model=DetectionStats)
async def get_stats(db: Session = Depends(get_db)):
    """
    Get detection statistics.
    """
    today = datetime.utcnow().date()

    total = db.query(func.count(DetectionEvent.id)).scalar() or 0

    today_count = (
        db.query(func.count(DetectionEvent.id))
        .filter(func.date(DetectionEvent.timestamp) == today)
        .scalar()
        or 0
    )

    unique_objects = (
        db.query(func.count(func.distinct(DetectionEvent.object_type))).scalar() or 0
    )

    avg_confidence = (
        db.query(func.avg(DetectionEvent.confidence)).scalar() or 0.0
    )

    last_detection = db.query(DetectionEvent.timestamp).order_by(
        desc(DetectionEvent.timestamp)
    ).first()

    return DetectionStats(
        total_detections=total,
        detections_today=today_count,
        unique_objects=unique_objects,
        average_confidence=float(avg_confidence),
        last_detection=last_detection[0] if last_detection else None,
    )


@router.post("/stats/by-object")
async def get_stats_by_object(db: Session = Depends(get_db)):
    """
    Get detection counts grouped by object type.
    """
    results = (
        db.query(
            DetectionEvent.object_type,
            func.count(DetectionEvent.id).label("count"),
            func.avg(DetectionEvent.confidence).label("avg_confidence"),
        )
        .group_by(DetectionEvent.object_type)
        .all()
    )

    return [
        {
            "object_type": row[0],
            "count": row[1],
            "avg_confidence": float(row[2]) if row[2] else 0.0,
        }
        for row in results
    ]


@router.post("/stats/by-device")
async def get_stats_by_device(db: Session = Depends(get_db)):
    """
    Get detection counts grouped by device.
    """
    results = (
        db.query(
            DetectionEvent.device_id,
            func.count(DetectionEvent.id).label("count"),
            func.max(DetectionEvent.timestamp).label("last_detection"),
        )
        .group_by(DetectionEvent.device_id)
        .all()
    )

    return [
        {
            "device_id": row[0],
            "count": row[1],
            "last_detection": row[2],
        }
        for row in results
    ]


@router.post("/device/status")
async def update_device_status(
    status: DeviceStatusUpdate, db: Session = Depends(get_db)
):
    """
    Update device status and health metrics.
    """
    device = db.query(DeviceStatus).filter_by(device_id=status.device_id).first()

    if not device:
        device = DeviceStatus(device_id=status.device_id)
        db.add(device)

    device.fps = status.fps
    device.cpu_usage = status.cpu_usage
    device.memory_usage = status.memory_usage
    device.model_type = status.model_type
    device.last_heartbeat = datetime.utcnow()
    device.is_online = True

    db.commit()
    db.refresh(device)

    return {"message": "Device status updated", "device_id": device.device_id}


@router.get("/device/status")
async def get_device_statuses(db: Session = Depends(get_db)):
    """
    Get status of all connected devices.
    """
    devices = db.query(DeviceStatus).all()

    # Check if devices are still online (heartbeat within 5 minutes)
    now = datetime.utcnow()
    for device in devices:
        time_diff = now - device.last_heartbeat
        device.is_online = time_diff < timedelta(minutes=5)

    return devices


@router.delete("/detections/{detection_id}")
async def delete_detection(detection_id: int, db: Session = Depends(get_db)):
    """
    Delete a detection event.
    """
    detection = db.query(DetectionEvent).filter_by(id=detection_id).first()

    if not detection:
        raise HTTPException(status_code=404, detail="Detection not found")

    db.delete(detection)
    db.commit()

    return {"message": "Detection deleted"}


@router.delete("/detections")
async def delete_old_detections(days: int = Query(30, ge=1), db: Session = Depends(get_db)):
    """
    Delete detections older than specified days.
    """
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    deleted_count = db.query(DetectionEvent).filter(
        DetectionEvent.timestamp < cutoff_date
    ).delete()

    db.commit()

    return {"message": f"Deleted {deleted_count} detections"}
