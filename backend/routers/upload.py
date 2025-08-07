import csv
from io import StringIO
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import logging
from alive_progress import alive_bar

from backend.database import get_db
from backend.models.order import Order
from backend.models.route import Route
from backend.models.truck import Truck
from backend.utils.parsing import parse_int, parse_location, parse_phone, parse_date
from backend.services.order_service import create_order

CAMPUS = "University of Virginia"

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/upload-orders")
async def upload_orders(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    content = await file.read()
    decoded = content.decode("utf-8")
    rows = list(csv.DictReader(StringIO(decoded)))
    inserted_count = 0
    skipped_count = 0

    with alive_bar(len(rows), title="Processing orders") as bar:    
        for row in rows:
            try:
                order_id = parse_int(row.get("OrderID"))
                campus = (row.get("CampusName") or "").strip()
                item_count = parse_int(row.get("ItemCount")) if row.get("ItemCount") else 0

                if order_id is None or campus != CAMPUS or item_count == 0:
                    logger.debug(f"Skipped inserting order {order_id} with campus '{campus}' and item_count {item_count}.")
                    skipped_count += 1
                    bar()
                    continue

                order = create_order(db, {
                    "id": order_id,
                    "campus": campus,
                    "name": row.get("FullName"),
                    "phone": parse_phone(row.get("StudentPhone")) if row.get("StudentPhone") else None,
                    "pickup_date": parse_date(row.get("PickupDate")),
                    "pickup_location": parse_location(row.get("PickupLocation"), row.get("PickupDormRoomNumber"), row.get("PickupDormRoomLetter"), row.get("PickupAddress"), row.get("PickupAddressLine2")),
                    "pickup_proxy_name": row.get("PickupPersonName"),
                    "pickup_proxy_phone": row.get("PickupPersonPhone"),
                    "dropoff_date": parse_date(row.get("DropoffDate")),
                    "dropoff_location": parse_location(row.get("DropOffLocation"), row.get("DropOffDormRoomNumber"), row.get("DropOffDormRoomLetter"), row.get("DropoffAddressLine1"), row.get("DropoffAddressLine2")),
                    "dropoff_proxy_name": row.get("DropoffPersonName"),
                    "dropoff_proxy_phone": row.get("DropoffPersonPhone"),
                    "item_count": item_count,
                    "items": "",
                })

                logger.debug(f"Inserted order {order.id} of student {order.name}")
                inserted_count += 1
                bar()
            except Exception as e:
                logger.warning(f"Skipped order {order_id} due to error: {e}", exc_info=True)
                db.rollback()
                skipped_count += 1
                bar()
                continue

    logger.info(f"Inserted {inserted_count} orders and skipped {skipped_count} orders from {file.filename}")
    return {
        "inserted": inserted_count, 
        "skipped": skipped_count
    }

@router.delete("/clear-database")
def clear_database(db: Session = Depends(get_db)):
    try:
        db.query(Order).delete()
        db.query(Route).delete()
        db.query(Truck).delete()
        db.commit()
        logger.warning("Database was cleared via /clear-database endpoint.")
        return {"message": "Database cleared"}
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to clear database: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to clear database")

