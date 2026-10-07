from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import date, datetime
from app.models.booking import BookingStatus, BookingSource, PaymentStatus
from app.schemas.room import RoomResponse, RoomTypeResponse
from app.schemas.user import UserResponse

class BookingCreate(BaseModel):
    hotel_id: str
    room_type_id: str
    check_in_date: date
    check_out_date: date
    adults: int = 1
    children: int = 0
    special_requests: Optional[str] = None
    discount_code: Optional[str] = None
    payment_method: str = "CARD"

class BookingResponse(BaseModel):
    id: str
    booking_reference: str
    guest_id: str
    hotel_id: str
    room_id: Optional[str] = None
    check_in_date: date
    check_out_date: date
    adults: int
    children: int
    base_amount: float
    tax_amount: float
    discount_amount: float
    total_amount: float
    status: BookingStatus
    payment_status: PaymentStatus
    booking_source: BookingSource
    special_requests: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    room: Optional[RoomResponse] = None
    guest: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)

class BookingStatusUpdate(BaseModel):
    status: BookingStatus

class InvoiceItem(BaseModel):
    description: str
    amount: float

class InvoiceResponse(BaseModel):
    invoice_number: str
    booking_reference: str
    guest_name: str
    guest_email: str
    hotel_name: str
    room_number: Optional[str] = None
    check_in_date: date
    check_out_date: date
    nights: int
    room_rate_per_night: float
    base_amount: float
    restaurant_charges: float = 0.0
    discount_amount: float
    tax_amount: float
    grand_total: float
    payment_status: str
    created_at: datetime
