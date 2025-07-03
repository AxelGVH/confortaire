from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class MachineBase(BaseModel):
    name: str
    model_no: Optional[str]
    department_id: UUID
    serial_no: Optional[str]
    input_power: Optional[float]
    voltage: Optional[float]
    amperes: Optional[float]
    phase: Optional[int]
    vendor_id: Optional[UUID]

class MachineCreate(MachineBase):
    pass

class MachineUpdate(MachineBase):
    pass

class MachineRead(MachineBase):
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
