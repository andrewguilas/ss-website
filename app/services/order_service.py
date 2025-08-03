# Handles smart creation of orders

from sqlalchemy.orm import Session
from datetime import date
from app.models.order import Order
from app.models.route import Route
from app.models.truck import Truck
import logging

logger = logging.getLogger(__name__)

def create_order(db: Session, order_data: dict) -> Order:
    dropoff_date = order_data.get("dropoff_date")

    if dropoff_date:
        route = db.query(Route).filter(Route.date == dropoff_date).order_by(Route.id).first()
        if route:
            logger.debug(f"Auto-assigned route {route.id} to order {order_data['id']}.")
        else:
            route = create_route(db, dropoff_date)
            db.add(route)
            db.commit()
            db.refresh(route)
            logger.debug(f"No route exists for date {dropoff_date}. Auto-generated and auto-assigned route {route.id} to order {order_data['id']}.")
    else:
        logger.debug(f"Order {order_data['id']} has no dropoff date; skipping route assignment.")

    route_id = route.id if dropoff_date else None
    order = Order(**order_data, route_id=route_id)
    db.add(order)
    db.commit()
    db.refresh(order)
    
    return order

def create_route(db: Session, dropoff_date: date) -> Route:
    used_truck_ids = set(
        truck_id for (truck_id,) in db.query(Route.truck_id)
        .filter(Route.date == dropoff_date)
        .distinct()
    )

    truck = (
        db.query(Truck)
        .filter(Truck.id.notin_(used_truck_ids))
        .order_by(Truck.id)
        .first()
    )
    is_truck_created = False

    if not truck:
        truck = Truck(comments=f"Auto-generated for route on {dropoff_date}")
        db.add(truck)
        db.commit()
        db.refresh(truck)
        is_truck_created = True

    new_route = Route(date=dropoff_date, truck_id=truck.id)
    if is_truck_created:
         logger.debug(f"No truck exists for route {new_route.id}. Auto-generated and auto-assigned truck {truck.id} to route.")

    return new_route
