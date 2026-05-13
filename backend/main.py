"""
Main FastAPI application for Dark Innovative - Construction & Fleet Management System.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path

from app.database.database import init_db, get_db
from app.routes.detections import router as detection_router
from app.routes.auth import router as auth_router, setup_demo_user
from app.routes.users import router as users_router
from app.routes.sites import router as sites_router
from app.routes.vehicles import router as vehicles_router
from app.routes.employees import router as employees_router
from app.routes.traffic import router as traffic_router
from app.routes.quotations import router as quotations_router
from app.routes.orders import router as orders_router
from app.routes.contact import router as contact_router

# Initialize database and run migrations
init_db()
from app.database.migrations import run_migrations
run_migrations()

# Create FastAPI app
app = FastAPI(
    title="Dark Innovative - Construction & Fleet Management",
    description="Real-time construction site and fleet management system",
    version="2.0.0",
)

# Configure CORS
origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(detection_router)
app.include_router(sites_router)
app.include_router(vehicles_router)
app.include_router(employees_router)
app.include_router(traffic_router)
app.include_router(quotations_router)
app.include_router(orders_router)
app.include_router(contact_router)

# Setup demo user on startup
@app.on_event("startup")
async def startup_event():
    """Setup demo user on application startup."""
    from app.database.database import SessionLocal
    db = SessionLocal()
    try:
        setup_demo_user(db)
    finally:
        db.close()


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Dark Innovative - Construction & Fleet Management System",
        "version": "2.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "message": "Backend is running",
    }


@app.get("/api/info")
async def get_info():
    """Get system information."""
    return {
        "system": "Dark Innovative",
        "version": "2.0.0",
        "backend": "FastAPI",
        "database": "PostgreSQL/SQLite",
        "features": [
            "Construction Site Tracking",
            "Vehicle Fleet Management",
            "Employee Tracking",
            "Traffic Analytics",
            "Real-time GPS Monitoring",
            "Quotation Management",
            "Order Management",
            "Gate Pass Control",
        ],
        "endpoints": [
            # Authentication
            "/auth/login",
            "/auth/register",
            "/auth/me",
            "/auth/logout",
            # User Management
            "/api/users",
            "/api/users/{user_id}",
            "/api/users/{user_id}/activate",
            "/api/users/{user_id}/deactivate",
            # Detections
            "/api/detections",
            "/api/detections/latest",
            "/api/stats",
            "/api/stats/by-object",
            "/api/stats/by-device",
            "/api/device/status",
            # Sites
            "/api/sites",
            "/api/sites/{site_id}",
            "/api/sites/{site_id}/stats",
            "/api/sites/{site_id}/detections",
            # Vehicles
            "/api/vehicles",
            "/api/vehicles/{vehicle_id}",
            "/api/vehicles/{vehicle_id}/location",
            "/api/vehicles/company/{company_id}/active",
            # Employees
            "/api/employees",
            "/api/employees/{employee_id}",
            "/api/employees/{employee_id}/check-in",
            "/api/employees/{employee_id}/check-out",
            "/api/employees/company/{company_id}/attendance",
            "/api/employees/site/{site_id}/on-site",
            # Traffic & Gate Passes
            "/api/traffic/gate-pass",
            "/api/traffic/gate-passes",
            "/api/traffic/vehicle",
            "/api/traffic/vehicles",
            "/api/traffic/site/{site_id}/current",
            "/api/traffic/site/{site_id}/stats",
            # Quotations
            "/api/quotations",
            "/api/quotations/{quotation_id}",
            "/api/quotations/{quotation_id}/approve",
            "/api/quotations/{quotation_id}/reject",
            "/api/quotations/company/{company_id}/stats",
            # Orders
            "/api/orders",
            "/api/orders/{order_id}",
            "/api/orders/{order_id}/ship",
            "/api/orders/{order_id}/deliver",
            "/api/orders/{order_id}/cancel",
            "/api/orders/company/{company_id}/stats",
        ],
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
