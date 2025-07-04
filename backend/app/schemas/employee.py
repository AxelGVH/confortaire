from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional

class TimestampMixin(BaseModel):
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str]
    department_id: UUID
    machine_id: UUID
    shift_id: UUID
    regular_hour_rate: float
    ot_hour_rate: float

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(EmployeeBase):
    pass

class EmployeeRead(EmployeeBase, TimestampMixin):
    id: UUID
    is_active: bool

    class Config:
        from_attributes = True  # orm_mode for Pydantic v2
