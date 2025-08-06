from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from backend.database import get_db
from backend.models.truck import Truck
from backend.models.route import Route
from backend.models.order import Order

logger = logging.getLogger(__name__)
router = APIRouter()

def has_orders(db, route_id):
    return db.query(Order).filter(Order.route_id == route_id).first()

def get_first_route_with_orders(db, truck_id):
    routes = db.query(Route).filter(Route.truck_id == truck_id).all()
    for route in routes:
        if has_orders(db, route.id):
            return route.id

@router.delete("/trucks/{truck_id}")
def delete_truck(truck_id: int, db: Session = Depends(get_db)):
    truck = db.query(Truck).filter(Truck.id == truck_id).first()
    if not truck:
        raise HTTPException(status_code=404, detail="Truck not found")

    first_route_id_with_orders = get_first_route_with_orders(db, truck.id)
    if first_route_id_with_orders:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete truck {truck_id}. Route {first_route_id_with_orders} has assigned orders. Reassign orders first."
        )

    logger.warning(f"Deleting Truck(id={truck.id}, model={truck.model}, comments={truck.comments})")
    db.delete(truck)
    db.commit()
    return {"detail": f"Truck {truck_id} deleted"}

@router.delete("/routes/{route_id}")
def delete_route(route_id: int, db: Session = Depends(get_db)):
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    if has_orders(db, route_id):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete route {route_id} because it has assigned orders. Reassign orders first."
        )

    logger.warning(f"Deleting Route(id={route.id}, date=\"{route.date}\", driver_name=\"{route.driver_name}\", comments=\"{route.comments}\", truck_id={route.truck_id})")

    db.delete(route)
    db.commit()
    return {"detail": f"Route {route_id} deleted"}

@router.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    db.delete(order)
    db.commit()
    return {"detail": f"Order {order_id} deleted"}
