from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.guest_request import GuestRequestType, GuestRequestStatus
from app.models.housekeeping import TaskPriority
from app.schemas.room import RoomResponse
from app.schemas.user import UserResponse

class GuestRequestCreate(BaseModel):
    request_type: GuestRequestType
    description: str
    priority: TaskPriority = TaskPriority.MEDIUM
    room_number: Optional[str] = None

class GuestRequestStatusUpdate(BaseModel):
    status: GuestRequestStatus
    assigned_staff_id: Optional[str] = None

class GuestRequestResponse(BaseModel):
    id: str
    guest_id: str
    room_id: Optional[str] = None
    booking_id: Optional[str] = None
    request_type: GuestRequestType
    description: str
    priority: TaskPriority
    status: GuestRequestStatus
    assigned_staff_id: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    guest: Optional[UserResponse] = None
    room: Optional[RoomResponse] = None
    assigned_staff: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)
