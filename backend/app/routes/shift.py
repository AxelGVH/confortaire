from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import get_db
from app.models.shift import Shift
from app.schemas.shift import ShiftCreate, ShiftRead
from datetime import datetime, timezone

router = APIRouter()

@router.get("/", response_model=list[ShiftRead])
def list_shifts(db: Session = Depends(get_db)):
    return db.query(Shift).filter(Shift.is_active == True).all()

@router.get("/{shift_id}", response_model=ShiftRead)
def get_shift(shift_id: UUID, db: Session = Depends(get_db)):
    shift = db.query(Shift).filter(Shift.id == shift_id.bytes).first()
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    return shift

@router.post("/", response_model=ShiftRead)
def create_shift(data: ShiftCreate, db: Session = Depends(get_db)):
    shift = Shift(
        name=data.name,
        start_time=data.start_time,
        end_time=data.end_time,
        is_active=True,
    )
    db.add(shift)
    db.commit()
    db.refresh(shift)
    return shift

@router.put("/{shift_id}", response_model=ShiftRead)
def update_shift(shift_id: UUID, data: ShiftCreate, db: Session = Depends(get_db)):
    shift = db.query(Shift).filter(Shift.id == shift_id.bytes).first()
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")

    shift.name = data.name
    shift.start_time = data.start_time
    shift.end_time = data.end_time
    db.commit()
    db.refresh(shift)
    return shift

@router.delete("/{shift_id}")
def delete_shift(shift_id: UUID, db: Session = Depends(get_db)):
    shift = db.query(Shift).filter(Shift.id == shift_id.bytes).first()
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    db.delete(shift)
    db.commit()
    return {"detail": "Shift deleted"}