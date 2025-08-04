from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    campus = Column(String, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    pronunciation = Column(String, nullable=True)
    comments = Column(Text, nullable=True)

    pickup_date = Column(Date, index=True, nullable=True)
    pickup_location = Column(String, nullable=True)
    pickup_proxy_name = Column(String, nullable=True)
    pickup_proxy_phone = Column(String, nullable=True)

    dropoff_date = Column(Date, index=True, nullable=True)
    dropoff_location = Column(String, nullable=True)
    dropoff_proxy_name = Column(String, nullable=True)
    dropoff_proxy_phone = Column(String, nullable=True)  

    item_count = Column(Integer, nullable=True)
    items = Column(Text, nullable=True)

    route_id = Column(Integer, ForeignKey("routes.id"), index=True)
    route = relationship("Route", back_populates="orders")

    def __repr__(self):
        return f"Order(id={self.id}, campus='{self.campus}', name='{self.name}', phone='{self.phone}', pronunciation='{self.pronunciation}', comments='{self.comments}', pickup_date='{self.pickup_date}', pickup_location='{self.pickup_location}', pickup_proxy_name='{self.pickup_proxy_name}', pickup_proxy_phone='{self.pickup_proxy_phone}', dropoff_date='{self.dropoff_date}', dropoff_location='{self.dropoff_location}', dropoff_proxy_name='{self.dropoff_proxy_name}', dropoff_proxy_phone='{self.dropoff_proxy_phone}', item_count={self.item_count}, items='{self.items}', route_id={self.route_id})"

    def __str__(self):
        return f"Order {self.id} - {self.name}"
