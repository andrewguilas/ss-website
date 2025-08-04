import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import date

from backend.database import Base
from backend.models.order import Order
from backend.models.route import Route
from backend.models.truck import Truck
from backend.services.order_service import create_order

@pytest.fixture(scope="function")
def db():
    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()

def minimal_order_data(id=1, dropoff_date=None):
    return {
        "id": id,
        "campus": "University of Virginia",
        "name": "Test Student",
        "phone": None,
        "pronunciation": None,
        "comments": None,
        "pickup_date": None,
        "pickup_location": None,
        "pickup_proxy_name": None,
        "pickup_proxy_phone": None,
        "dropoff_date": dropoff_date,
        "dropoff_location": None,
        "dropoff_proxy_name": None,
        "dropoff_proxy_phone": None,
        "item_count": 1,
        "items": "",
    }

def test_create_order_without_dropoff_date(db):
    order_data = minimal_order_data(id=1, dropoff_date=None)
    order = create_order(db, order_data)
    assert order.id == 1
    assert order.route_id is None
    assert db.query(Order).count() == 1

def test_create_order_with_existing_route(db):
    # Pre-create truck and route
    truck = Truck(id=1, model="Ford Transit")
    db.add(truck)
    db.commit()

    route = Route(id=1, date=date(2025, 8, 24), truck_id=truck.id)
    db.add(route)
    db.commit()

    order_data = minimal_order_data(id=2, dropoff_date=date(2025, 8, 24))
    order = create_order(db, order_data)

    assert order.route_id == route.id
    assert db.query(Route).count() == 1
    assert db.query(Order).filter_by(route_id=route.id).count() == 1

def test_create_order_creates_new_route_and_truck(db):
    order_data = minimal_order_data(id=3, dropoff_date=date(2025, 9, 1))
    order = create_order(db, order_data)

    # Should have 1 order, 1 route, 1 truck
    assert db.query(Order).count() == 1
    assert db.query(Route).count() == 1
    assert db.query(Truck).count() == 1

    route = db.query(Route).first()
    truck = db.query(Truck).first()
    assert route.truck_id == truck.id
    assert order.route_id == route.id

def test_create_order_uses_existing_unused_truck(db):
    # Truck is created but not assigned to any route on this date
    truck = Truck(id=2, model="Unused Truck")
    db.add(truck)
    db.commit()

    order_data = minimal_order_data(id=4, dropoff_date=date(2025, 10, 10))
    order = create_order(db, order_data)

    route = db.query(Route).first()
    assert route.truck_id == truck.id
    assert order.route_id == route.id
