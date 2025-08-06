import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.database import Base
from backend.models.truck import Truck
from backend.services.truck_service import create_truck

@pytest.fixture(scope="function")
def db():
    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()

def test_create_truck_with_all_fields(db):
    truck_data = {"model": "Ford Transit", "comments": "Main campus truck"}
    truck = create_truck(db, truck_data)
    assert truck.id is not None
    assert truck.model == "Ford Transit"
    assert truck.comments == "Main campus truck"
    assert db.query(Truck).count() == 1

def test_create_truck_with_minimal_fields(db):
    truck_data = {}
    truck = create_truck(db, truck_data)
    assert truck.id is not None
    assert truck.model is None
    assert truck.comments is None
    assert db.query(Truck).count() == 1

def test_create_multiple_trucks(db):
    truck1 = create_truck(db, {"model": "A"})
    truck2 = create_truck(db, {"model": "B", "comments": "Second truck"})
    assert truck1.id != truck2.id
    assert db.query(Truck).count() == 2

def test_create_truck_invalid_field_raises(db):
    truck_data = {"model": "X", "invalid_field": "should fail"}
    with pytest.raises(TypeError):
        create_truck(db, truck_data)
