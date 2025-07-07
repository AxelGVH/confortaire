from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, date, time
from typing import Optional, Literal


StatusLiteral = Literal["Created", "In Progress", "Completed", "Halted"]
PriorityLiteral = Literal["Low", "Medium", "High"]
ActivityTypeLiteral = Literal["Preventive", "On Spot"]

class TimestampMixin(BaseModel):
    created_at: datetime
    updated_at: datetime

class ActivityBase(BaseModel):
    machine_id: UUID
    activity_type: ActivityTypeLiteral
    priority: PriorityLiteral
    status: StatusLiteral = "Created"
    date: date
    start_time: time
    required_time: time
    details: str
    assigned_to: Optional[UUID] = None  # hidden from UI for now

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(ActivityBase):
    pass

class ActivityRead(ActivityBase, TimestampMixin):
    id: UUID
    is_active: bool

    class Config:
        from_attributes = True
