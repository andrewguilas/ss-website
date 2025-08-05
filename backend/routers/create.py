from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from backend.database import get_db
from backend.services.truck_service import create_truck
from backend.services.route_service import create_route
from backend.schemas.truck import TruckCreate, TruckRead
from backend.schemas.route import RouteCreate, RouteRead

router = APIRouter()

@router.post("/trucks", response_model=TruckRead)
def create_truck_route(truck: TruckCreate, db: Session = Depends(get_db)):
    try:
        new_truck = create_truck(db, truck.model_dump(exclude_unset=True))
        return new_truck
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/routes", response_model=RouteRead)
def create_route_api(route: RouteCreate, db: Session = Depends(get_db)):
    try:
        new_route = create_route(db, route.model_dump(exclude_unset=True))
        return new_route
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))