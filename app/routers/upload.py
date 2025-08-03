import csv
from io import StringIO
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.order import Order
from app.utils.parsing import parse_int, parse_location, parse_phone, parse_date
from app.utils.openai import ask_openai

CAMPUS = "University of Virginia"

router = APIRouter()

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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload-orders")
async def upload_orders(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    content = await file.read()
    decoded = content.decode("utf-8")
    reader = csv.DictReader(StringIO(decoded))

    inserted_count = 0
    for row in reader:
        if not row.get("campus") or row.get("campus") != CAMPUS or not row.get("orders") or row.get("orders") == 0:
            continue

        try:
            order = Order(
                id=parse_int(row.get("OrderID")),
                campus=row.get("CampusName"),
                name=row.get("FullName"),
                phone=parse_phone(row.get("StudentPhone")) if row.get("StudentPhone") else None,
                pronunciation=fetch_pronunciation(row.get("FullName")) if row.get("FullName") else None,
                comments=get_comments(dropoff_proxy_name=row.get("DropoffPersonName"), dropoff_proxy_phone=row.get("DropoffPersonProxy")),
                pickup_date=parse_date(row.get("PickupDate")),
                pickup_location=parse_location(row.get("PickupLocation"), row.get("PickupDormRoomNumber"), row.get("PickupDormRoomLetter"), row.get("PickupAddress"), row.get("PickupAddressLine2")),
                pickup_proxy_name=row.get("PickupPersonName"),
                pickup_proxy_phone=row.get("PickupPersonPhone"),
                dropoff_date=parse_date(row.get("DropoffDate")),
                dropoff_location=parse_location(row.get("DropOffLocation"), row.get("DropOffDormRoomNumber"), row.get("DropOffDormRoomLetter"), row.get("DropoffAddressLine1"), row.get("DropoffAddressLine2")),
                dropoff_proxy_name=row.get("DropoffPersonName"),
                dropoff_proxy_phone=row.get("DropoffPersonProxy"),
                item_count=parse_int(row.get("ItemCount")) if row.get("ItemCount") else None,
                items="",
                route_id=row.get("route_id")
            )

            db.add(order)
            inserted_count += 1

        except Exception as e:
            print(f"Skipping rows due to error: {e}")
            continue

    db.commit()
    return {"inserted": inserted_count}

