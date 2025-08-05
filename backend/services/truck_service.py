# Handles smart creation of routes

from sqlalchemy.orm import Session
import logging

from backend.models.truck import Truck

logger = logging.getLogger(__name__)

def create_truck(db: Session, truck_data: dict):
    try:
        new_truck = Truck(**truck_data)
        db.add(new_truck)
        db.commit()
        db.refresh(new_truck)
        logger.debug(f"Created truck {new_truck.id}.")

        return new_truck
    except Exception as e:
        logger.error(f"Failed to create truck: {e}", exc_info=True)
        db.rollback()
        raise
