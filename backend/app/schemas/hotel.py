from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class HotelBase(BaseModel):
    name: str
    description: str
    address: str
    city: str
    state: str
    country: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: str
    email: str
    check_in_time: str = "15:00"
    check_out_time: str = "11:00"
    rating: float = 4.9

class HotelCreate(HotelBase):
    pass

class HotelResponse(HotelBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
