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

        custom_truck_id = route_data.get("truck_id")
        if custom_truck_id:
            conflicting_truck = (
                db.query(Route)
                .filter(Route.date == date, Route.truck_id == custom_truck_id)
                .first()
            )
            if conflicting_truck:
                raise Exception(f"Truck {custom_truck_id} is already assigned to a route on {date}.")

            assigned_truck = db.query(Truck).filter(Truck.id == custom_truck_id).first()
            if not assigned_truck:
                raise Exception(f"Truck {custom_truck_id} does not exist.")
        else:
            assigned_truck = get_first_truck_on_date(db, date)
            if not assigned_truck:
                assigned_truck = create_truck(db, {"comments": f"Auto-generated for route on date {date}"})
                logger.debug(f"Auto-generated truck {assigned_truck.id} for route on date {date}.")

        custom_comment = f"Auto-assigned truck {assigned_truck.id}"
        route_data["comments"] = (
            f"{route_data['comments']}. {custom_comment}" if route_data.get("comments") else custom_comment
        )

        route_data["truck_id"] = assigned_truck.id
        new_route = Route(**route_data)
        db.add(new_route)
        db.commit()
        db.refresh(new_route)
        logger.debug(f"Created route {new_route.id}. Auto-assigned truck {assigned_truck.id}.")

        return new_route
    except Exception as e:
        logger.error(f"Failed to create route for date {date}: {e}", exc_info=True)
        db.rollback()
        raise
