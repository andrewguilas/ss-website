from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date as date_class

from backend.database import get_db
from backend.models.order import Order
from backend.models.route import Route
from backend.models.truck import Truck
from backend.utils.parsing import parse_phone

router = APIRouter()

class OrderUpdate(BaseModel):
    id: int
    campus: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    pronunciation: Optional[str] = None
    comments: Optional[str] = None
    pickup_date: Optional[date_class] = None
    pickup_location: Optional[str] = None
    pickup_proxy_name: Optional[str] = None
    pickup_proxy_phone: Optional[str] = None
    dropoff_date: Optional[date_class] = None
    dropoff_location: Optional[str] = None
    dropoff_proxy_name: Optional[str] = None
    dropoff_proxy_phone: Optional[str] = None
    item_count: Optional[int] = None
    items: Optional[str] = None
    route_id: Optional[int] = None

class RouteUpdate(BaseModel):
    id: int
    driver_name: Optional[str] = None
    comments: Optional[str] = None
    truck_id: Optional[int] = None

class TruckUpdate(BaseModel):
    id: int
    model: Optional[str] = None
    comments: Optional[str] = None

def get_order_or_404(db, order_id):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

def get_route_or_404(db, route_id):
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    return route

def get_truck_or_404(db, truck_id):
    truck = db.query(Truck).filter(Truck.id == truck_id).first()
    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")
    return truck

@router.patch("/orders")
def edit_orders(update: OrderUpdate, db: Session = Depends(get_db)):
    order = get_order_or_404(db, update.id)
    
    # Check if the new route exists (if route_id is being updated)
    if update.route_id is not None:
        get_route_or_404(db, update.route_id)

    if update.phone is not None:
        update.phone = parse_phone(update.phone)
    if update.pickup_proxy_phone is not None:
        update.pickup_proxy_phone = parse_phone(update.pickup_proxy_phone)
    if update.dropoff_proxy_phone is not None:
        update.dropoff_proxy_phone = parse_phone(update.dropoff_proxy_phone)

    for field, value in update.model_dump(exclude_unset=True).items():
        if field != "id":
            setattr(order, field, value)

    db.commit()
    db.refresh(order)
    return order

@router.patch("/routes")
def edit_routes(update: RouteUpdate, db: Session = Depends(get_db)):
    route = get_route_or_404(db, update.id)

    # Check if the new truck exists (if truck_id is being updated)
    if update.truck_id is not None:
        get_truck_or_404(db, update.truck_id)

    # Check for duplicate truck assignment on the same day
    new_truck_id = update.truck_id if update.truck_id is not None else route.truck_id
    if new_truck_id:
        conflicting_route = (
            db.query(Route)
            .filter(
                Route.id != route.id,
                Route.date == route.date,
                Route.truck_id == new_truck_id
            )
            .first()
        )
        if conflicting_route:
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

@router.patch("/trucks")
def edit_trucks(update: TruckUpdate, db: Session = Depends(get_db)):
    truck = get_truck_or_404(db, update.id)
    
    for field, value in update.model_dump(exclude_unset=True).items():
        if field != "id":
            setattr(truck, field, value)

    db.commit()
    db.refresh(truck)
    return truck
