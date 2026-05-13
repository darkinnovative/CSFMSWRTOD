"""
Schemas for order endpoints.
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class OrderBase(BaseModel):
    client_name: str
    amount: float
    scope: str
    due_date: datetime


class OrderCreate(OrderBase):
    company_id: int
    quotation_id: Optional[int] = None


class OrderUpdate(BaseModel):
    status: Optional[str] = None
    amount: Optional[float] = None


class OrderResponse(OrderBase):
    id: int
    company_id: int
    quotation_id: Optional[int]
    status: str
    order_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class OrderStatsResponse(BaseModel):
    total_orders: int
    processing: int
    shipped: int
    delivered: int
    cancelled: int
    total_revenue: float
