from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from datetime import datetime

# Shared
class TimestampMixin(BaseModel):
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Vendor
class VendorBase(BaseModel):
    name: str
    address: Optional[str]
    city: Optional[str]
    zipcode: Optional[str]
    email: Optional[EmailStr]
    phone: Optional[str]
    registration_no: Optional[str]
    contact_person_name: Optional[str]

class VendorCreate(VendorBase):
    pass

class VendorRead(VendorBase, TimestampMixin):
    id: UUID
    is_active: bool