from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Truck(Base):
    __tablename__ = "trucks"

    id = Column(Integer, primary_key=True, index=True)
    model = Column(String, nullable=True)
    comments = Column(Text, nullable=True)

    routes = relationship("Route", back_populates="truck")

    def __repr__(self):
        return f"Truck(id={self.id}, model='{self.model}', comments='{self.comments}')"

    def __str__(self):
        route_count = len(self.routes)
        return f"Truck {self.id} - Model {self.model} - {route_count} Route(s)"
