from pydantic import BaseModel
from typing import Optional
from datetime import date

class OrderCreate(BaseModel):
    id: int
    campus: str
    name: str
    phone: Optional[str] = None
    pronunciation: Optional[str] = None
    comments: Optional[str] = None
    pickup_date: Optional[date] = None
    pickup_location: Optional[str] = None
    pickup_proxy_name: Optional[str] = None
    pickup_proxy_phone: Optional[str] = None
    dropoff_date: Optional[date] = None
    dropoff_location: Optional[str] = None
    dropoff_proxy_name: Optional[str] = None
    dropoff_proxy_phone: Optional[str] = None
    item_count: Optional[int] = None
    items: Optional[str] = None

class OrderRead(OrderCreate):
    route_id: Optional[int] = None

    class ConfigDict:
        from_attributes = True
