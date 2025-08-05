from pydantic import BaseModel
from typing import Optional
from datetime import date

class RouteCreate(BaseModel):
    date: date
    driver_name: Optional[str] = None
    comments: Optional[str] = None

class RouteRead(RouteCreate):
    id: int
    truck_id: int

    class Config:
        orm_mode = True
        