from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.models.restaurant import RestaurantOrderStatus

class MenuCategoryResponse(BaseModel):
    id: str
    hotel_id: str
    name: str
    display_order: int

    model_config = ConfigDict(from_attributes=True)

class MenuItemResponse(BaseModel):
    id: str
    category_id: str
    name: str
    description: str
    price: float
    image_url: Optional[str] = None
    dietary_flags: List[str] = []
    prep_time_minutes: int = 20
    is_available: bool = True

    model_config = ConfigDict(from_attributes=True)

class OrderItemCreate(BaseModel):
    menu_item_id: str
    quantity: int = 1
    instructions: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: str
    menu_item_id: str
    quantity: int
    unit_price: float
    total_price: float
    instructions: Optional[str] = None
    menu_item: Optional[MenuItemResponse] = None

    model_config = ConfigDict(from_attributes=True)

class OrderCreate(BaseModel):
    room_number: str
    items: List[OrderItemCreate]
    special_notes: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: RestaurantOrderStatus

class OrderResponse(BaseModel):
    id: str
    order_reference: str
    guest_id: str
    room_id: Optional[str] = None
    room_number: str
    total_amount: float
    status: RestaurantOrderStatus
    special_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
