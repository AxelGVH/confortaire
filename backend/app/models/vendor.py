# SQLAlchemy Models and Pydantic Schemas for Vendor, Machine, Shift, and Employee

import uuid
from datetime import datetime, time, timezone
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Numeric, Time
from sqlalchemy.dialects.mysql import BINARY
from sqlalchemy.orm import relationship
from app.database import Base

# ------------------------
# Vendor Model
# ------------------------
class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes)
    name = Column(String(255), nullable=False)
    address = Column(String(255))
    city = Column(String(100))
    zipcode = Column(String(20))
    email = Column(String(100))
    phone = Column(String(20))
    registration_no = Column(String(100))
    contact_person_name = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))