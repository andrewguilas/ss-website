# Handles smart creation of orders

from sqlalchemy.orm import Session
from datetime import date
import logging

from backend.models.order import Order
from backend.models.route import Route
from backend.models.truck import Truck

logger = logging.getLogger(__name__)

def create_order(db: Session, order_data: dict) -> Order:
    dropoff_date = order_data.get("dropoff_date")

    try:
        route = None
        if dropoff_date:
            route = db.query(Route).filter(Route.date == dropoff_date).order_by(Route.id).first()
            if route:
                logger.debug(f"Auto-assigned route {route.id} to order {order_data.get('id', '<no-id>')}.")
            else:
                logger.info(f"No route found for dropoff date {dropoff_date}. Creating new route...")
                route = create_route(db, dropoff_date)
                db.add(route)
                db.commit()
                db.refresh(route)
                logger.info(f"Created new route {route.id} for dropoff date {dropoff_date} and assigned to order {order_data.get('id', '<no-id>')}.")

        if route:
            route_id = route.id
        else:
            logger.debug(f"Order {order_data.get('id', '<no-id>')} has no route assigned due to missing dropoff date.")
            route_id = None

        order = Order(**order_data, route_id=route_id)
        db.add(order)
        db.commit()
        db.refresh(order)
        logger.info(f"Successfully created order {order.id}.")
        return order
    except Exception as e:
        logger.error(f"Failed to create order {order_data.get('id', '<no-id>')}: {e}", exc_info=True)
        db.rollback()
        raise

def create_route(db: Session, dropoff_date: date) -> Route:
    try:
        used_truck_ids = set(
            truck_id for (truck_id,) in db.query(Route.truck_id)
            .filter(Route.date == dropoff_date)
            .distinct()
        )
        logger.debug(f"Used truck IDs on {dropoff_date}: {used_truck_ids}")

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
            logger.info(f"Created new truck {truck.id} for dropoff date {dropoff_date} as none available.")

        new_route = Route(date=dropoff_date, truck_id=truck.id, comments=f"Auto-generated for date {dropoff_date}")
        logger.debug(f"Created new route object for date {dropoff_date} with truck {truck.id} (truck_created={is_truck_created})")

        return new_route
    except Exception as e:
        logger.error(f"Failed to create route for dropoff date {dropoff_date}: {e}", exc_info=True)
        db.rollback()
        raise
