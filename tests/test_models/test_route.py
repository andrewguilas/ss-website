import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models.truck import Truck
from app.models.route import Route
from app.models.order import Order
from datetime import date

@pytest.fixture(scope="module")
def db():
    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()

def test_create_route_and_link_to_truck(db):
    truck = Truck(id=1, model="Ram ProMaster")
    db.add(truck)
    db.commit()

    route = Route(id=1, date=date(2025, 8, 24), driver_name="Alex", truck_id=truck.id, comments="Morning shift")
    db.add(route)
    db.commit()

    result = db.query(Route).filter_by(id=1).first()
    assert result.driver_name == "Alex"
    assert result.truck_id == truck.id
    assert result.truck.model == "Ram ProMaster"
    assert str(result) == "Route 1 - Date 2025-08-24 - Driver Alex - 0 Order(s)"
    assert "Route(id=1" in repr(result)

def test_route_order_relationship(db):
    route = db.query(Route).filter_by(id=1).first()
    order = Order(id=1001, campus="UVA", name="Student A", route_id=route.id)
    db.add(order)
    db.commit()

    refreshed_route = db.query(Route).filter_by(id=1).first()
    assert len(refreshed_route.orders) == 1
    assert refreshed_route.orders[0].name == "Student A"
