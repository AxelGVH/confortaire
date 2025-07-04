import uuid
from datetime import datetime, timezone, date, time
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Enum, Float, Date, Time
from sqlalchemy.dialects.mysql import BINARY
from app.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes)
    machine_id = Column(BINARY(16), ForeignKey("machines.id"), nullable=False)
    activity_type = Column(String(100), nullable=False)
    priority = Column(Enum("Low", "Medium", "High", "Critical"), nullable=False)
    status = Column(Enum("Created", "In Progress", "Completed", "Halted"), default="Created", nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    required_time = Column(Float, nullable=False)
    details = Column(String(1000), nullable=False)
    assigned_to = Column(BINARY(16), ForeignKey("employees.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
