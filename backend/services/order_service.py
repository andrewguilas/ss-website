# Handles smart creation of orders

from sqlalchemy.orm import Session
import logging

from backend.models.order import Order
from backend.models.route import Route
from backend.services.route_service import create_route

logger = logging.getLogger(__name__)

def create_order(db: Session, order_data: dict) -> Order:
    try:
        existing_order = db.query(Order).filter(Order.id == order_data["id"]).first()
        if existing_order:
            raise Exception("Order already exists")

        route_id = None
        date = order_data.get("dropoff_date")
        if date:
            first_available_route = db.query(Route).filter(Route.date == date).order_by(Route.id).first()
            if not first_available_route:
                first_available_route = create_route(
                    db, {"date": date, "comments": f"Auto-generated for order on date {date}"}
                )
                logger.debug(f"Auto-generated route {first_available_route.id} for order on date {date}")
            route_id = first_available_route.id

        new_order = Order(**order_data, route_id=route_id)
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        logger.debug(f"Created order {new_order.id} for student {new_order.name}.")

        return new_order
    except Exception as e:
        logger.error(f"Failed to create order {order_data.get('id', '<no-id>')}: {e}", exc_info=True)
        db.rollback()
        raise
