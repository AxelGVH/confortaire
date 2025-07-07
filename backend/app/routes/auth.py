from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.database import SessionLocal
from app.utils.auth import hash_password, verify_password, create_access_token
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError
from app.utils.auth import decode_token
from uuid import UUID

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        user_id = UUID(payload.get("sub")).bytes
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid UUID format in token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=user_data.email,
        password=hash_password(user_data.password),
        role=user_data.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

from uuid import UUID

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Convert binary UUID to string
    user_uuid = str(UUID(bytes=user.id))  # ✅ Proper conversion
    access_token = create_access_token(data={"sub": user_uuid})

    return {"access_token": access_token, "token_type": "bearer"}



@router.get("/me", response_model=UserResponse)
def read_me(current_user: User = Depends(get_current_user)):
    return {
        "id": UUID(bytes=current_user.id),
        "email": current_user.email,
        "name": current_user.name,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "created_by": UUID(bytes=current_user.created_by) if current_user.created_by else None,
        "updated_by": UUID(bytes=current_user.updated_by) if current_user.updated_by else None,
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at
    }
