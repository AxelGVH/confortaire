import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.part import Part
from app.schemas.part import PartCreate, PartRead, PartUpdate

router = APIRouter()

def to_bytes(u: uuid.UUID) -> bytes:
    return u.bytes if isinstance(u, uuid.UUID) else u

# -------------------------
# Create a new part
# -------------------------
@router.post("/", response_model=PartRead, status_code=status.HTTP_201_CREATED)
def create_part(part: PartCreate, db: Session = Depends(get_db)):
    db_part = Part(**part.dict())
    db.add(db_part)
    db.commit()
    db.refresh(db_part)
    return db_part

# -------------------------
# List all parts
# -------------------------
@router.get("/", response_model=List[PartRead])
def list_parts(db: Session = Depends(get_db)):
    return db.query(Part).filter(Part.is_active == True).all()

# -------------------------
# Get a single part
# -------------------------
@router.get("/{part_id}", response_model=PartRead)
def get_part(part_id: uuid.UUID, db: Session = Depends(get_db)):
    part = db.query(Part).filter(Part.id == to_bytes(part_id), Part.is_active == True).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    return part

# -------------------------
# Update a part
# -------------------------
@router.put("/{part_id}", response_model=PartRead)
def update_part(part_id: uuid.UUID, update: PartUpdate, db: Session = Depends(get_db)):
    part = db.query(Part).filter(Part.id == to_bytes(part_id), Part.is_active == True).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")

    for field, value in update.dict().items():
        setattr(part, field, value)

    db.commit()
    db.refresh(part)
    return part

# -------------------------
# Soft delete a part
# -------------------------
@router.delete("/{part_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_part(part_id: uuid.UUID, db: Session = Depends(get_db)):
    part = db.query(Part).filter(Part.id == to_bytes(part_id), Part.is_active == True).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")

    part.is_active = False
    db.commit()
