import uuid
from sqlalchemy import Column, String, DateTime, BINARY
from app.database import Base
from datetime import datetime, timezone

class FileAttachment(Base):
    __tablename__ = "attachments"

    id = Column(BINARY(16), primary_key=True, default=lambda: uuid.uuid4().bytes)
    file_name = Column(String(255), nullable=False)
    content_type = Column(String(100))
    file_path = Column(String(255), nullable=False)
    entity_type = Column(String(100), nullable=False)  # e.g., 'machine'
    entity_id = Column(BINARY(16), nullable=False)
    tags = Column(String(255), nullable=True)  # Comma-separated string
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
