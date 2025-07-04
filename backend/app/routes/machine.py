from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import get_db
from app.models.machine import Machine
from app.schemas.machine import MachineCreate, MachineRead, MachineUpdate

router = APIRouter()

@router.get("/", response_model=list[MachineRead])
def list_machines(db: Session = Depends(get_db)):
    return db.query(Machine).filter(Machine.is_active == True).all()

@router.get("/{machine_id}", response_model=MachineRead)
def get_machine(machine_id: UUID, db: Session = Depends(get_db)):
    machine = db.query(Machine).filter(Machine.id == machine_id.bytes).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine

@router.post("/", response_model=MachineRead)
def create_machine(machine: MachineCreate, db: Session = Depends(get_db)):
    machine_data = machine.dict()

    # Convert UUIDs to bytes
    machine_data["department_id"] = machine_data["department_id"].bytes
    if machine_data.get("vendor_id"):
        machine_data["vendor_id"] = machine_data["vendor_id"].bytes

    db_machine = Machine(**machine_data)
    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)
    return db_machine


@router.put("/{machine_id}", response_model=MachineRead)
def update_machine(machine_id: UUID, updated: MachineUpdate, db: Session = Depends(get_db)):
    db_machine = db.query(Machine).filter(Machine.id == machine_id.bytes).first()
    if not db_machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    for key, value in updated.dict().items():
        setattr(db_machine, key, value)
    db.commit()
    db.refresh(db_machine)
    return db_machine

@router.delete("/{machine_id}")
def deactivate_machine(machine_id: UUID, db: Session = Depends(get_db)):
    db_machine = db.query(Machine).filter(Machine.id == machine_id.bytes).first()
    if not db_machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    db_machine.is_active = False
    db.commit()
    return {"message": "Machine deactivated"}
