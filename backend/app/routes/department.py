from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.schemas.department import DepartmentCreate, DepartmentRead
from app.models.department import Department
from app.dependencies import get_db  # your session handler

router = APIRouter()

@router.post("/", response_model=DepartmentRead)
def create_department(dept: DepartmentCreate, db: Session = Depends(get_db)):
    new_dept = Department(**dept.dict())
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    return new_dept

@router.get("/", response_model=list[DepartmentRead])
def list_departments(db: Session = Depends(get_db)):
    return db.query(Department).all()

@router.get("/{dept_id}", response_model=DepartmentRead)
def get_department(dept_id: UUID, db: Session = Depends(get_db)):
    department = db.query(Department).filter(Department.id == dept_id.bytes).first()
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    return department

@router.delete("/{dept_id}", status_code=204)
def delete_department(dept_id: UUID, db: Session = Depends(get_db)):
    department = db.query(Department).filter(Department.id == dept_id.bytes).first()
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    db.delete(department)
    db.commit()

@router.put("/{department_id}", response_model=DepartmentRead)
def update_department(
    department_id: UUID,
    dept: DepartmentCreate,  # or a specific DepartmentUpdate schema
    db: Session = Depends(get_db),
):
    department = db.query(Department).filter(Department.id == department_id.bytes).first()
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    
    department.name = dept.name
    department.description = dept.description
    department.is_active = dept.is_active
    db.commit()
    db.refresh(department)
    return department
