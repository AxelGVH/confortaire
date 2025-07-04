from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class FileAttachmentRead(BaseModel):
    id: UUID
    file_name: str
    content_type: str
    file_path: str
    entity_type: str
    entity_id: UUID
    tags: Optional[str] = None
    created_at: datetime


    class Config:
        orm_mode = True
