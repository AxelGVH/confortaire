import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Numeric
from sqlalchemy.dialects.mysql import BINARY
from app.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes)
    name = Column(String(255), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    phone = Column(String(20))
    department_id = Column(BINARY(16), ForeignKey("departments.id"), nullable=False)
    machine_id = Column(BINARY(16), ForeignKey("machines.id"), nullable=False)
    shift_id = Column(BINARY(16), ForeignKey("shifts.id"), nullable=False)
    regular_hour_rate = Column(Numeric(10, 2))
    ot_hour_rate = Column(Numeric(10, 2))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<Employee(name={self.name}, email={self.email})>"
