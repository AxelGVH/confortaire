from pydantic import BaseModel, field_validator
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

    # Convert UUIDs to bytes for use with BINARY(16) in MySQL
    @field_validator("department_id", "vendor_id", mode="before")
    @classmethod
    def convert_uuid_to_bytes(cls, v):
        return v.bytes if isinstance(v, UUID) else v


class MachineCreate(MachineBase):
    pass


class MachineUpdate(MachineBase):
    pass


class MachineRead(BaseModel):
    id: UUID
    name: str
    model_no: Optional[str]
    department_id: UUID
    serial_no: Optional[str]
    input_power: Optional[float]
    voltage: Optional[float]
    amperes: Optional[float]
    phase: Optional[int]
    vendor_id: Optional[UUID]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
