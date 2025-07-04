import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.activity import Activity
from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityRead

router = APIRouter(
    prefix="/activities",
    tags=["Activities"]
)

def to_bytes(u: uuid.UUID) -> bytes:
    return u.bytes if isinstance(u, uuid.UUID) else u

# -------------------------
# Create Activity
# -------------------------
@router.post("/", response_model=ActivityRead, status_code=status.HTTP_201_CREATED)
def create_activity(activity: ActivityCreate, db: Session = Depends(get_db)):
    data = activity.dict()
    data["machine_id"] = to_bytes(data["machine_id"])
    if data.get("assigned_to"):
        data["assigned_to"] = to_bytes(data["assigned_to"])

    db_activity = Activity(**data)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

# -------------------------
# List All Active Activities
# -------------------------
@router.get("/", response_model=List[ActivityRead])
def list_activities(db: Session = Depends(get_db)):
    return db.query(Activity).filter(Activity.is_active == True).all()

# -------------------------
# Get a Single Activity
# -------------------------
@router.get("/{activity_id}", response_model=ActivityRead)
def get_activity(activity_id: uuid.UUID, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == to_bytes(activity_id), Activity.is_active == True).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity

# -------------------------
# Update Activity
# -------------------------
@router.put("/{activity_id}", response_model=ActivityRead)
def update_activity(activity_id: uuid.UUID, update: ActivityUpdate, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == to_bytes(activity_id), Activity.is_active == True).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    data = update.dict()
    data["machine_id"] = to_bytes(data["machine_id"])
    if data.get("assigned_to"):
        data["assigned_to"] = to_bytes(data["assigned_to"])

    for key, value in data.items():
        setattr(activity, key, value)

    db.commit()
    db.refresh(activity)
    return activity

