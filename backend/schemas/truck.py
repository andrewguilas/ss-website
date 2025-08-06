from pydantic import BaseModel
from typing import Optional

class TruckCreate(BaseModel):
    model: Optional[str] = None
    comments: Optional[str] = None

class TruckRead(BaseModel):
    id: int
    model: Optional[str] = None
    comments: Optional[str] = None

    class ConfigDict:
        from_attributes = True

