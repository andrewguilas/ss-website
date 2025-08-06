import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import date

from backend.database import Base
from backend.models.route import Route
from backend.models.truck import Truck
from backend.services.route_service import create_route, get_first_truck_on_date

@pytest.fixture(scope="function")
def db():
    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()

def test_create_route_auto_assigns_truck(db):
    # No trucks exist yet
    route_data = {"date": date(2025, 8, 24), "comments": "Morning route"}
    route = create_route(db, route_data)
    assert route.id is not None
    assert route.truck_id is not None
    assert db.query(Truck).count() == 1
    assert "Auto-assigned truck" in route.comments

def test_create_route_reuses_available_truck(db):
    # Create a truck not assigned to any route on this date
    truck = Truck(model="Reusable Truck")
    db.add(truck)
    db.commit()

    route_data = {"date": date(2025, 8, 25)}
    route = create_route(db, route_data)
    assert route.truck_id == truck.id
    assert db.query(Route).count() == 1

def test_truck_not_double_assigned(db):
    # Create a truck and assign it to a route on a specific date
    truck = Truck(model="Busy Truck")
    db.add(truck)
    db.commit()

    route1 = Route(date=date(2025, 8, 26), truck_id=truck.id)
    db.add(route1)
    db.commit()

    # Now create another route for the same date; should get a new truck
    route_data = {"date": date(2025, 8, 26)}
    route2 = create_route(db, route_data)
    assert route2.truck_id != truck.id
    assert db.query(Truck).count() == 2

def test_get_first_truck_on_date(db):
    truck1 = Truck(model="T1")
    truck2 = Truck(model="T2")
    db.add_all([truck1, truck2])
    db.commit()

    # Assign truck1 to a route on the date
    route = Route(date=date(2025, 8, 27), truck_id=truck1.id)
    db.add(route)
    db.commit()

    # Only truck2 should be available
    available_truck = get_first_truck_on_date(db, date(2025, 8, 27))
    assert available_truck.id == truck2.id
