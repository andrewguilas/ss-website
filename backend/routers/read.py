from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.order import Order
from backend.models.route import Route
from backend.models.truck import Truck

router = APIRouter()

@router.get("/orders")
def get_orders(db: Session = Depends(get_db)):
    return (
        db.query(Order)
        .join(Route)
        .order_by(Route.date, Order.order_in_route)
        .all()
    )

@router.get("/routes")
def get_routes(db: Session = Depends(get_db)):
    return db.query(Route).all()

@router.get("/trucks")
def get_trucks(db: Session = Depends(get_db)):
    return db.query(Truck).all()