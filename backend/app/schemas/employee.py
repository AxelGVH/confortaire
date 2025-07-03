class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str]
    department_id: UUID
    machine_id: UUID
    shift_id: UUID
    regular_hour_rate: float
    ot_hour_rate: float

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeRead(EmployeeBase, TimestampMixin):
    id: UUID
    is_active: bool