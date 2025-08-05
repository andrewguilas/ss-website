from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date as date_class

from backend.database import get_db
from backend.models.order import Order
from backend.models.route import Route
from backend.models.truck import Truck

router = APIRouter()

class RouteUpdate(BaseModel):
    id: int
    date: Optional[date_class] = None
    driver_name: Optional[str] = None
    comments: Optional[str] = None
    truck_id: Optional[int] = None

class TruckUpdate(BaseModel):
    id: int
    model: Optional[str] = None
    comments: Optional[str] = None

@router.put("/orders")
def edit_orders(db: Session = Depends(get_db)):
    pass

@router.put("/routes")
def edit_routes(update: RouteUpdate, db: Session = Depends(get_db)):
    route = db.query(Route).filter(Route.id == update.id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    # Check if the new truck exists (if truck_id is being updated)
    if update.truck_id is not None:
        truck = db.query(Truck).filter(Truck.id == update.truck_id).first()
        if not truck:
            raise HTTPException(status_code=404, detail="Truck not found")

    # Check for duplicate truck assignment on the same day
    new_date = update.date if update.date is not None else route.date
    new_truck_id = update.truck_id if update.truck_id is not None else route.truck_id
    if new_date and new_truck_id:
        conflict = (
            db.query(Route)
            .filter(
                Route.id != route.id,
                Route.date == new_date,
                Route.truck_id == new_truck_id
            )
            .first()
        )
        if conflict:
            raise HTTPException(
                status_code=400,
                detail="This truck is already assigned to another route on this date."
            )

    for field, value in update.model_dump(exclude_unset=True).items():
        if field != "id":
            setattr(route, field, value)

    db.commit()
    db.refresh(route)
    return route

@router.put("/trucks")
def edit_trucks(update: TruckUpdate, db: Session = Depends(get_db)):
    truck = db.query(Truck).filter(Truck.id == update.id).first()
    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")
    
    for field, value in update.model_dump(exclude_unset=True).items():
        if field != "id":
            setattr(truck, field, value)

    db.commit()
    db.refresh(truck)
    return truck
