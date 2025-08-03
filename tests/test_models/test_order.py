import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.order import Order
from app.models.route import Route
from app.database import Base
from datetime import date

@pytest.fixture(scope="module")
def test_db():
    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()

def test_create_order_without_route(test_db):
    order = Order(
        id=1,
        campus="University of Virginia",
        name="Andy Guilas",
        phone="(929) 339-9244",
        pronunciation="AN-dee",
        comments="N/A",
        pickup_date=date(2025, 5, 10),
        pickup_location="Location A",
        pickup_proxy_name="Friend",
        pickup_proxy_phone="1234567890",
        dropoff_date=date(2025, 8, 24),
        dropoff_location="Location B",
        dropoff_proxy_name="Mom",
        dropoff_proxy_phone="0987654321",
        item_count=2,
        items="",
        route_id=None
    )
    test_db.add(order)
    test_db.commit()
    retrieved = test_db.query(Order).filter_by(id=1).first()
    assert retrieved.name == "Andy Guilas"
    assert retrieved.pickup_location == "Location A"
    assert str(retrieved) == "Order 1 - Andy Guilas"
    assert "Order(id=1" in repr(retrieved)

def test_create_order_with_route(test_db):
    route = Route(id=1, date=date(2025, 8, 24), driver_name="Joe", comments="")
    test_db.add(route)
    test_db.commit()

    order = Order(
        id=2,
        campus="University of Virginia",
        name="Jane Doe",
        dropoff_date=date(2025, 8, 24),
        route_id=route.id
    )
    test_db.add(order)
    test_db.commit()

    retrieved = test_db.query(Order).filter_by(id=2).first()
    assert retrieved.route.id == route.id
    assert retrieved.route.date == date(2025, 8, 24)
