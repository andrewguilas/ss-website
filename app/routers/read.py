from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order
from app.models.route import Route
from app.models.truck import Truck

router = APIRouter()

@router.get("/orders")
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()

@router.get("/routes")
def get_routes(db: Session = Depends(get_db)):
    return db.query(Route).all()

@router.get("/trucks")
def get_trucks(db: Session = Depends(get_db)):
    return db.query(Truck).all()