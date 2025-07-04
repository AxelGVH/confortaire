import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Enum, Boolean, DateTime
from sqlalchemy.dialects.mysql import BINARY
from app.database import Base

class Part(Base):
    __tablename__ = "parts"

    id = Column(BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes)
    part_name = Column(String(255), nullable=False)
    part_number = Column(String(100), nullable=False)
    part_type = Column(Enum("Consumables", "Regular", "Other"), nullable=False)
    unit = Column(Enum("Count", "Length", "Weight", "Volume", "Area"), nullable=False)
    available_qty = Column(Float, nullable=False)
    description = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
