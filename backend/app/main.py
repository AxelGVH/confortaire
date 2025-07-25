from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import department
from app.routes import auth
from app.routes import user
from app.routes import shift
from app.routes import vendor
from app.routes import upload
from app.routes import machine
from app.routes import employee
from app.routes import part
from app.routes import activity
from app.database import Base, engine

app = FastAPI(
    title="Confortaire API",
    version="1.0.0"
)

origins = [
    "http://52.66.195.192",       # ✅ Your deployed frontend domain
    "http://localhost:3000",      # ✅ For local testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Optional: Add CORS middleware if frontend will talk to this API

# Register routes
app.include_router(department.router, prefix="/departments", tags=["Departments"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(shift.router, prefix="/shifts", tags=["Shifts"])
app.include_router(vendor.router, prefix="/vendors", tags=["Vendors"])
app.include_router(machine.router, prefix="/machines", tags=["Machines"])
app.include_router(employee.router, prefix="/employees", tags=["Employees"])
app.include_router(part.router, prefix="/parts", tags=["Parts"])
app.include_router(activity.router, prefix="/activities", tags=["Activities"])
app.include_router(upload.router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
