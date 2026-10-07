from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.room import RoomStatus

class RoomTypeBase(BaseModel):
    name: str
    description: str
    capacity: int
    base_price: float
    size_sqft: int
    bed_type: str
    amenities: List[str] = []
    images: List[str] = []

class RoomTypeCreate(RoomTypeBase):
    hotel_id: str

class RoomTypeResponse(RoomTypeBase):
    id: str
    hotel_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class RoomBase(BaseModel):
    room_number: str
    floor: int
    status: RoomStatus = RoomStatus.AVAILABLE

class RoomCreate(RoomBase):
    hotel_id: str
    room_type_id: str

class RoomUpdateStatus(BaseModel):
    status: RoomStatus

class RoomResponse(RoomBase):
    id: str
    hotel_id: str
    room_type_id: str
    current_guest_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    room_type: Optional[RoomTypeResponse] = None

    model_config = ConfigDict(from_attributes=True)

class RoomAvailabilityQuery(BaseModel):
    hotel_id: Optional[str] = None
    check_in: str
    check_out: str
    adults: int = 1
    children: int = 0
    room_type_id: Optional[str] = None

class AvailableRoomTypeResponse(BaseModel):
    room_type: RoomTypeResponse
    total_inventory: int
    available_count: int
    price_per_night: float
