from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import department
from app.routes import auth
from app.routes import user

app = FastAPI(
    title="Confortaire API",
    version="1.0.0"
)

# Optional: Add CORS middleware if frontend will talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(department.router, prefix="/departments", tags=["Departments"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(auth.router, prefix="/user", tags=["User"])
