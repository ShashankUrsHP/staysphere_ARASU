from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.maintenance import MaintenanceIssueType, MaintenancePriority, MaintenanceStatus
from app.schemas.room import RoomResponse
from app.schemas.user import UserResponse

class MaintenanceCreate(BaseModel):
    room_id: str
    issue_type: MaintenanceIssueType
    description: str
    priority: MaintenancePriority = MaintenancePriority.MEDIUM
    assigned_staff_id: Optional[str] = None

class MaintenanceStatusUpdate(BaseModel):
    status: MaintenanceStatus
    assigned_staff_id: Optional[str] = None

class MaintenanceResponse(BaseModel):
    id: str
    room_id: str
    reported_by: str
    assigned_staff_id: Optional[str] = None
    issue_type: MaintenanceIssueType
    description: str
    priority: MaintenancePriority
    status: MaintenanceStatus
    created_at: datetime
    resolved_at: Optional[datetime] = None

    room: Optional[RoomResponse] = None
    reporter: Optional[UserResponse] = None
    assigned_staff: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)
