from pydantic import BaseModel
from typing import Optional
from datetime import date

class RouteCreate(BaseModel):
    date: date
    driver_name: Optional[str] = None
    comments: Optional[str] = None
    truck_id: Optional[int] = None

class RouteUpdate(BaseModel):
    id: int
    driver_name: Optional[str] = None
    comments: Optional[str] = None
    truck_id: Optional[int] = None

class RouteRead(BaseModel):
    id: int
    date: date
    driver_name: Optional[str] = None
    comments: Optional[str] = None
    truck_id: Optional[int] = None

    class ConfigDict:
        from_attributes = True
