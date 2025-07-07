import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
from app.models.fileattachment import FileAttachment
from app.schemas.fileattachment import FileAttachmentRead
from app.database import get_db

router = APIRouter(prefix="/upload", tags=["File Uploads"])

UPLOAD_DIR = "uploads"

@router.post("/", response_model=FileAttachmentRead)
async def upload_file(
    file: UploadFile = File(...),
    entity_type: str = Form(...),
    entity_id: UUID = Form(...),
    tags: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    contents = await file.read()
    max_size = 10 * 1024 * 1024
    if len(contents) > max_size:
        raise HTTPException(status_code=413, detail="File too large")

    save_dir = os.path.join(UPLOAD_DIR, entity_type, str(entity_id))
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, file.filename)

    with open(save_path, "wb") as f:
        f.write(contents)

    attachment = FileAttachment(
        file_name=file.filename,
        content_type=file.content_type,
        file_path=save_path,
        entity_type=entity_type,
        entity_id=entity_id.bytes,
        tags=tags,
    )

    db.add(attachment)
    db.commit()
    db.refresh(attachment)
    return attachment


@router.get("/attachments", response_model=list[FileAttachmentRead])
def get_attachments(
    entity_type: str = Query(...),
    entity_id: UUID = Query(...),
    db: Session = Depends(get_db),
):
    return db.query(FileAttachment).filter(
        FileAttachment.entity_type == entity_type,
        FileAttachment.entity_id == entity_id.bytes
    ).all()

@router.delete("/attachments/{attachment_id}")
def delete_attachment(attachment_id: UUID, db: Session = Depends(get_db)):
    attachment = db.query(FileAttachment).filter(FileAttachment.id == attachment_id.bytes).first()
    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")

    # Delete the file from disk (optional)
    try:
        if os.path.exists(attachment.file_path):
            os.remove(attachment.file_path)
    except Exception as e:
        print(f"Warning: File delete failed: {e}")

    db.delete(attachment)
    db.commit()
    return {"message": "Attachment deleted"}
