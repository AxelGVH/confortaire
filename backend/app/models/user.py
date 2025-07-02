import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.mysql import BINARY
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes, unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(String(50), default="user")
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


    # ✅ Fix: `Column(...)` must include type — add `BINARY(16)` for UUIDs
    created_by = Column(BINARY(16), nullable=True)
    updated_by = Column(BINARY(16), nullable=True)

    is_active = Column(Boolean, default=True)
