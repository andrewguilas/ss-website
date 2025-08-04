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
from backend.utils.openai import ask_openai
from backend.services.order_service import create_order

CAMPUS = "University of Virginia"

router = APIRouter()
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
            campus = (row.get("CampusName") or "").strip()
            item_count_str = row.get("ItemCount")
            item_count = parse_int(item_count_str) if item_count_str else 0

            if campus != CAMPUS or item_count == 0:
                logger.debug(f"Skipping order with campus '{campus}' and item_count {item_count}.")
                skipped_count += 1
                bar()
                continue

            order_id = parse_int(row.get("OrderID"))
            try:
                existing = db.query(Order).filter(Order.id == order_id).first()
                if existing:
                    logger.warning(f"Order with id {existing.id} already exists, skipping.")
                    skipped_count += 1
                    bar()
                    continue

                order = create_order(db, {
                    "id": order_id,
                    "campus": campus,
                    "name": row.get("FullName"),
                    "phone": parse_phone(row.get("StudentPhone")) if row.get("StudentPhone") else None,
                    "pronunciation": fetch_pronunciation(row.get("FullName")) if row.get("FullName") else None,
                    "comments": get_comments(dropoff_proxy_name=row.get("DropoffPersonName"), dropoff_proxy_phone=row.get("DropoffPersonPhone")),
                    "pickup_date": parse_date(row.get("PickupDate")),
                    "pickup_location": parse_location(
                        row.get("PickupLocation"), row.get("PickupDormRoomNumber"),
                        row.get("PickupDormRoomLetter"), row.get("PickupAddress"),
                        row.get("PickupAddressLine2")
                    ),
                    "pickup_proxy_name": row.get("PickupPersonName"),
                    "pickup_proxy_phone": row.get("PickupPersonPhone"),
                    "dropoff_date": parse_date(row.get("DropoffDate")),
                    "dropoff_location": parse_location(
                        row.get("DropOffLocation"), row.get("DropOffDormRoomNumber"),
                        row.get("DropOffDormRoomLetter"), row.get("DropoffAddressLine1"),
                        row.get("DropoffAddressLine2")
                    ),
                    "dropoff_proxy_name": row.get("DropoffPersonName"),
                    "dropoff_proxy_phone": row.get("DropoffPersonProxy"),
                    "item_count": item_count,
                    "items": "",
                })

                logger.debug(f"Inserting order {order.id} - Student {order.name}")
                inserted_count += 1
                bar()
            except Exception as e:
                logger.warning(f"Skipping order ID {order_id} due to error: {e}", exc_info=True)
                db.rollback()
                skipped_count += 1
                bar()
                continue

    db.commit()
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

