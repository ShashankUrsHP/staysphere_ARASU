from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.payment import PaymentMethod, PaymentTransactionStatus

class PaymentCreate(BaseModel):
    booking_id: str
    amount: float
    currency: str = "INR"
    payment_method: PaymentMethod = PaymentMethod.CARD

class PaymentResponse(BaseModel):
    id: str
    booking_id: str
    guest_id: str
    transaction_id: str
    amount: float
    currency: str
    payment_method: PaymentMethod
    status: PaymentTransactionStatus
    paid_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
