import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime, time, timezone

class FileAttachment(Base):
    __tablename__ = "attachments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_name = Column(String, nullable=False)
    content_type = Column(String)
    file_path = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)  # e.g., 'machine'
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    tags = Column(String, nullable=True)  # Comma-separated string
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
