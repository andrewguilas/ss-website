from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from backend.database import get_db
from backend.models.order import Order
from backend.models.route import Route
from backend.models.truck import Truck

router = APIRouter()

class TruckUpdate(BaseModel):
    id: int
    model: Optional[str] = None
    comments: Optional[str] = None

@router.put("/orders")
def edit_orders(db: Session = Depends(get_db)):
    pass

@router.put("/routes")
def edit_routes(db: Session = Depends(get_db)):
    pass

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
