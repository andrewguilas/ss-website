from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base

class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    driver_name = Column(String, nullable=True)
    comments = Column(Text, nullable=True)

    truck_id = Column(Integer, ForeignKey("trucks.id"), index=True)
    truck = relationship("Truck", back_populates="routes")

    orders = relationship("Order", back_populates="route")

    def __repr__(self):
        return f"Route(id={self.id}, date='{self.date}', driver_name='{self.driver_name}', comments='{self.comments}', truck_id={self.truck_id})"

    def __str__(self):
        order_count = len(self.orders) if self.orders else 0
        return f"Route {self.id} - Date {self.date} - Driver {self.driver_name} - {order_count} Order(s)"
