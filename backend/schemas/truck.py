from pydantic import BaseModel
from typing import Optional

class TruckRead(BaseModel):
    id: int
    model: Optional[str] = None
    comments: Optional[str] = None

    class Config:
        orm_mode = True

class TruckCreate(BaseModel):
    model: Optional[str] = None
    comments: Optional[str] = None
    