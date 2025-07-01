from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session  # type: ignore
from uuid import UUID
from typing import List

from app.database import get_db
from app.models.user import User
from app.routes.auth import get_current_user, hash_password  # type: ignore
from app.schemas.user import UserResponse, UserCreate, UserUpdate

router = APIRouter()


@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_user = User(
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
        created_by=current_user.id,
        updated_by=current_user.id,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: UUID,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_user = db.query(User).filter(User.id == user_id.bytes).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.email = user.email or db_user.email
    if user.password:
        db_user.password = hash_password(user.password) or db_user.password
    db_user.role = user.role or db_user.role
    db_user.updated_by = current_user.id
    db.commit()
    db.refresh(db_user)
    return db_user


@router.delete("/{user_id}")
def deactivate_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_user = db.query(User).filter(User.id == user_id.bytes).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.is_active = False
    db_user.updated_by = current_user.id
    db.commit()
    return {"detail": "User deactivated"}


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_user = db.query(User).filter(User.id == user_id.bytes).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get("/", response_model=List[UserResponse])
def list_users(
    status: str = "active",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(User)
    if status == "active":
        query = query.filter(User.is_active == True)
    elif status == "inactive":
        query = query.filter(User.is_active == False)
    return query.all()
