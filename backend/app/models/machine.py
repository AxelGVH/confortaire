import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, ForeignKey, DateTime, BINARY
from datetime import datetime, timezone
from app.database import Base

class Machine(Base):
    __tablename__ = "machines"

    id = Column(BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes)
    name = Column(String(200), nullable=False)
    model_no = Column(String(100))
    department_id = Column(BINARY(16), ForeignKey("departments.id"), nullable=False)
    serial_no = Column(String(100))
    input_power = Column(Float)
    voltage = Column(Float)
    amperes = Column(Float)
    phase = Column(Integer)
    vendor_id = Column(BINARY(16), ForeignKey("vendors.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
