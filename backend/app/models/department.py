import uuid
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.mysql import BINARY
from datetime import datetime
from app.database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes, unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(String(1024), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    created_by = Column(BINARY(16), nullable=True)
    updated_by = Column(BINARY(16), nullable=True)

    is_active = Column(Boolean, default=True)
