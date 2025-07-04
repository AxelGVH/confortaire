import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeRead, EmployeeUpdate
from app.dependencies import get_db

router = APIRouter()

# Helper to convert UUID to bytes
def to_bytes(uuid_val: uuid.UUID) -> bytes:
    return uuid_val.bytes if isinstance(uuid_val, uuid.UUID) else uuid_val

# --------------------
# Create Employee
# --------------------
@router.post("/", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    data = employee.dict()
    data["department_id"] = to_bytes(data["department_id"])
    data["machine_id"] = to_bytes(data["machine_id"])
    data["shift_id"] = to_bytes(data["shift_id"])

    db_employee = Employee(**data)
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

# --------------------
# Get All Employees
# --------------------
@router.get("/", response_model=List[EmployeeRead])
def list_employees(db: Session = Depends(get_db)):
    return db.query(Employee).filter(Employee.is_active == True).all()

# --------------------
# Get Single Employee
# --------------------
@router.get("/{employee_id}", response_model=EmployeeRead)
def get_employee(employee_id: uuid.UUID, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == to_bytes(employee_id), Employee.is_active == True).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

# --------------------
# Update Employee
# --------------------
@router.put("/{employee_id}", response_model=EmployeeRead)
def update_employee(employee_id: uuid.UUID, update: EmployeeUpdate, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == to_bytes(employee_id), Employee.is_active == True).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    data = update.dict()
    data["department_id"] = to_bytes(data["department_id"])
    data["machine_id"] = to_bytes(data["machine_id"])
    data["shift_id"] = to_bytes(data["shift_id"])

    for key, value in data.items():
        setattr(emp, key, value)

    db.commit()
    db.refresh(emp)
    return emp

# --------------------
# Delete Employee (Soft Delete)
# --------------------
@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: uuid.UUID, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == to_bytes(employee_id), Employee.is_active == True).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    emp.is_active = False
    db.commit()
    return
