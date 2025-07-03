from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.models.vendor import Vendor
from app.schemas.vendor import VendorCreate, VendorRead
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=list[VendorRead])
def list_vendors(db: Session = Depends(get_db)):
    return db.query(Vendor).filter(Vendor.is_active == True).all()

@router.get("/{vendor_id}", response_model=VendorRead)
def get_vendor(vendor_id: UUID, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id.bytes, Vendor.is_active == True).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@router.post("/", response_model=VendorRead)
def create_vendor(vendor: VendorCreate, db: Session = Depends(get_db)):
    db_vendor = Vendor(**vendor.dict())
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

@router.put("/{vendor_id}", response_model=VendorRead)
def update_vendor(vendor_id: UUID, updated: VendorCreate, db: Session = Depends(get_db)):
    db_vendor = db.query(Vendor).filter(Vendor.id == vendor_id.bytes).first()
    if not db_vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    for key, value in updated.dict().items():
        setattr(db_vendor, key, value)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

@router.delete("/{vendor_id}")
def deactivate_vendor(vendor_id: UUID, db: Session = Depends(get_db)):
    db_vendor = db.query(Vendor).filter(Vendor.id == vendor_id.bytes).first()
    if not db_vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    db_vendor.is_active = False
    db.commit()
    return {"message": "Vendor deactivated"}
