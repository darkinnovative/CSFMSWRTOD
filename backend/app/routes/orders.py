"""
Routes for order management endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from datetime import datetime
from typing import List

from app.database.database import get_db
from app.database.models import Order, User
from app.schemas.orders import (
    OrderCreate,
    OrderResponse,
    OrderUpdate,
    OrderStatsResponse,
)
from app.auth import get_current_user, verify_admin

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("/", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Create a new order for user's company. Admin only."""
    order = Order(
        **order_data.dict(),
        company_id=admin_user.company_id
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/", response_model=List[OrderResponse])
async def get_orders(
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all orders for user's company."""
    query = db.query(Order).filter(
        Order.company_id == current_user.company_id
    ).order_by(desc(Order.order_date))
    
    if status:
        query = query.filter(Order.status == status)
    
    orders = query.offset(skip).limit(limit).all()
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific order details."""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.company_id == current_user.company_id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int,
    order_data: OrderUpdate,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Update order information. Admin only."""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.company_id == admin_user.company_id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    for key, value in order_data.dict(exclude_unset=True).items():
        setattr(order, key, value)
    
    db.commit()
    db.refresh(order)
    return order


@router.post("/{order_id}/ship", response_model=OrderResponse)
async def ship_order(
    order_id: int,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """Mark order as shipped. Admin only."""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.company_id == admin_user.company_id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = "shipped"
    db.commit()
    db.refresh(order)
    return order


@router.post("/{order_id}/deliver", response_model=OrderResponse)
async def deliver_order(
    order_id: int,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """Mark order as delivered. Admin only."""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.company_id == admin_user.company_id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = "delivered"
    db.commit()
    db.refresh(order)
    return order


@router.post("/{order_id}/cancel", response_model=OrderResponse)
async def cancel_order(
    order_id: int,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """Cancel an order. Admin only."""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.company_id == admin_user.company_id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = "cancelled"
    db.commit()
    db.refresh(order)
    return order


@router.delete("/{order_id}")
async def delete_order(
    order_id: int,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """Delete an order. Admin only."""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.company_id == admin_user.company_id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(order)
    db.commit()
    return {"message": "Order deleted successfully"}


@router.get("/stats", response_model=OrderStatsResponse)
async def get_order_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get order statistics for current user's company."""
    total = db.query(func.count(Order.id)).filter(
        Order.company_id == current_user.company_id
    ).scalar() or 0
    processing = db.query(func.count(Order.id)).filter(
        Order.company_id == current_user.company_id, Order.status == "processing"
    ).scalar() or 0
    shipped = db.query(func.count(Order.id)).filter(
        Order.company_id == current_user.company_id, Order.status == "shipped"
    ).scalar() or 0
    delivered = db.query(func.count(Order.id)).filter(
        Order.company_id == current_user.company_id, Order.status == "delivered"
    ).scalar() or 0
    cancelled = db.query(func.count(Order.id)).filter(
        Order.company_id == current_user.company_id, Order.status == "cancelled"
    ).scalar() or 0
    total_revenue = db.query(func.sum(Order.amount)).filter(
        Order.company_id == current_user.company_id, Order.status == "delivered"
    ).scalar() or 0.0
    
    return OrderStatsResponse(
        total_orders=total,
        processing=processing,
        shipped=shipped,
        delivered=delivered,
        cancelled=cancelled,
        total_revenue=float(total_revenue),
    )
