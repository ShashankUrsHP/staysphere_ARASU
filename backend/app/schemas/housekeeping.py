from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.housekeeping import HousekeepingTaskType, TaskPriority, TaskStatus
from app.schemas.room import RoomResponse
from app.schemas.user import UserResponse

class HousekeepingCreate(BaseModel):
    room_id: str
    task_type: HousekeepingTaskType
    priority: TaskPriority = TaskPriority.MEDIUM
    description: Optional[str] = None
    assigned_staff_id: Optional[str] = None

class HousekeepingStatusUpdate(BaseModel):
    status: TaskStatus
    assigned_staff_id: Optional[str] = None

class HousekeepingResponse(BaseModel):
    id: str
    room_id: str
    assigned_staff_id: Optional[str] = None
    task_type: HousekeepingTaskType
    priority: TaskPriority
    status: TaskStatus
    description: Optional[str] = None
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    room: Optional[RoomResponse] = None
    assigned_staff: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)
