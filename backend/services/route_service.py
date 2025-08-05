# Handles smart creation of routes

from sqlalchemy.orm import Session
from datetime import date as date_type
import logging

from backend.models.route import Route
from backend.models.truck import Truck
from backend.services.truck_service import create_truck

logger = logging.getLogger(__name__)

def get_first_truck_on_date(db: Session, date: date_type):
    busy_truck_ids = set(
        truck_id for (truck_id,) in db.query(Route.truck_id)
        .filter(Route.date == date)
        .distinct()
    )
    logger.debug(f"Busy truck IDs on {date}: {busy_truck_ids}")

    first_available_truck = (
        db.query(Truck)
        .filter(Truck.id.notin_(busy_truck_ids))
        .order_by(Truck.id)
        .first()
    )

    return first_available_truck

def create_route(db: Session, route_data: dict) -> Route:
    try:
        date = route_data.get("date")
        if not date:
            raise Exception("Missing order date.")

        first_available_truck = get_first_truck_on_date(db, date)
        if not first_available_truck:
            first_available_truck = create_truck(db, {"comments": f"Auto-generated for route on date {date}"})
            logger.debug(f"Auto-generated truck {first_available_truck.id} for route on date {date}.")

        custom_comment = f"Auto-assigned truck {first_available_truck.id}"
        route_data["comments"] =  f"{route_data['comments']}. {custom_comment}" if route_data.get("comments") else custom_comment
        
        new_route = Route(**route_data, truck_id=first_available_truck.id)
        db.add(new_route)
        db.commit()
        db.refresh(new_route)
        logger.debug(f"Created route {new_route.id}. Auto-assigned truck {first_available_truck.id}.")
    
        return new_route
    except Exception as e:
        logger.error(f"Failed to create route for date {date}: {e}", exc_info=True)
        db.rollback()
        raise
