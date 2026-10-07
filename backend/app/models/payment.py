import enum
from datetime import datetime, timezone
import uuid
from sqlalchemy import String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class PaymentMethod(str, enum.Enum):
    UPI = "UPI"
    CARD = "CARD"
    NET_BANKING = "NET_BANKING"
    PAY_AT_HOTEL = "PAY_AT_HOTEL"

class PaymentTransactionStatus(str, enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"

class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id: Mapped[str] = mapped_column(String(36), ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False)
    guest_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    transaction_id: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    payment_method: Mapped[PaymentMethod] = mapped_column(SQLEnum(PaymentMethod), default=PaymentMethod.CARD, nullable=False)
    payment_gateway: Mapped[str] = mapped_column(String(50), default="StaySphere Pay Gate")
    status: Mapped[PaymentTransactionStatus] = mapped_column(SQLEnum(PaymentTransactionStatus), default=PaymentTransactionStatus.COMPLETED, nullable=False)
    paid_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    booking = relationship("Booking", back_populates="payments")
    guest = relationship("User", foreign_keys="[Payment.guest_id]")
