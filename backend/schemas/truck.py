from pydantic import BaseModel
from typing import Optional

class TruckRead(BaseModel):
    id: int
    model: Optional[str] = None
    comments: Optional[str] = None

    class ConfigDict:
        from_attributes = True

class TruckCreate(BaseModel):
    model: Optional[str] = None
    comments: Optional[str] = None
    