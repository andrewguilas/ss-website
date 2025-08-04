import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models.truck import Truck

@pytest.fixture(scope="module")
def db():
    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()

def test_create_truck(db):
    truck = Truck(id=1, model="Ford Transit", comments="Main campus truck")
    db.add(truck)
    db.commit()

    result = db.query(Truck).filter_by(id=1).first()
    assert result.model == "Ford Transit"
    assert result.comments == "Main campus truck"
    assert str(result) == "Truck 1 - Model Ford Transit - 0 Route(s)"
    assert "Truck(id=1" in repr(result)
