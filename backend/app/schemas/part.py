from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, Literal


class TimestampMixin(BaseModel):
    created_at: datetime
    updated_at: datetime

class PartBase(BaseModel):
    part_name: str
    part_number: str
    part_type: Literal["Consumables", "Regular", "Other"]
    unit: Literal["Count", "Length", "Weight", "Volume", "Area"]
    available_qty: float
    description: Optional[str]

class PartCreate(PartBase):
    pass

class PartUpdate(PartBase):
    pass

class PartRead(PartBase, TimestampMixin):
    id: UUID
    is_active: bool

    class Config:
        from_attributes = True
