# Handles smart creation of orders

from sqlalchemy.orm import Session
from sqlalchemy import func
import logging

from backend.models.order import Order
from backend.models.route import Route
from backend.services.route_service import create_route
from backend.utils.openai import ask_openai
from backend.utils.parsing import parse_phone

logger = logging.getLogger(__name__)

def fetch_pronunciation(full_name):
    first_name = full_name.split(" ")[0]
    try:
        return ask_openai(f"In one word, no fluff, give me the pronunciation of the first name {first_name}")
    except Exception:
        return

def get_comments(dropoff_proxy_name=None, dropoff_proxy_phone=None):
    comments = []
    if dropoff_proxy_name and dropoff_proxy_phone:
        dropoff_proxy_phone = parse_phone(dropoff_proxy_phone)
        comments.append(f"Call Proxy {dropoff_proxy_name} at {dropoff_proxy_phone}.")
    return "\n".join(comments)

def create_order(db: Session, order_data: dict) -> Order:
    try:
        existing_order = db.query(Order).filter(Order.id == order_data["id"]).first()
        if existing_order:
            raise Exception("Order already exists")

        order_data["pronunciation"] = fetch_pronunciation(order_data["name"])
        order_data["comments"] = get_comments(order_data["dropoff_proxy_name"], order_data["dropoff_proxy_phone"])

        route_id = None
        order_in_route = None
        date = order_data.get("dropoff_date")
        if date:
            first_available_route = db.query(Route).filter(Route.date == date).order_by(Route.id).first()
            if not first_available_route:
                first_available_route = create_route(
                    db, {"date": date, "comments": f"Auto-generated for order on date {date}"}
                )
                logger.debug(f"Auto-generated route {first_available_route.id} for order on date {date}")
            route_id = first_available_route.id

            max_order = db.query(func.max(Order.order_in_route)).filter(Order.route_id == route_id).scalar()
            order_data["order_in_route"] = (max_order or 0) + 1

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
