from pydantic import BaseModel
from datetime import time, datetime
from uuid import UUID

class ShiftBase(BaseModel):
    name: str
    start_time: time
    end_time: time
    is_active: bool = True

class ShiftCreate(ShiftBase):
    pass

class ShiftRead(ShiftBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
