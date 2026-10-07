import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.booking import Booking, PaymentStatus
from app.models.payment import Payment, PaymentMethod, PaymentTransactionStatus
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
async def process_payment(
    req: PaymentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Booking).where(Booking.id == req.booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    transaction_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"

    payment = Payment(
        booking_id=req.booking_id,
        guest_id=current_user.id,
        transaction_id=transaction_id,
        amount=req.amount,
        currency=req.currency,
        payment_method=req.payment_method,
        status=PaymentTransactionStatus.COMPLETED,
        paid_at=datetime.now(timezone.utc)
    )
    db.add(payment)

    booking.payment_status = PaymentStatus.PAID
    await db.commit()
    await db.refresh(payment)
    return payment
