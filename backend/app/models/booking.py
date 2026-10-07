import enum
from datetime import datetime, date, timezone
import uuid
from sqlalchemy import String, Integer, Float, Text, Date, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class BookingStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    CHECKED_IN = "CHECKED_IN"
    CHECKED_OUT = "CHECKED_OUT"
    CANCELLED = "CANCELLED"
    NO_SHOW = "NO_SHOW"

class BookingSource(str, enum.Enum):
    DIRECT = "DIRECT"
    WEBSITE = "WEBSITE"
    WALK_IN = "WALK_IN"
    OTA = "OTA"
    CORPORATE = "CORPORATE"

class PaymentStatus(str, enum.Enum):
    UNPAID = "UNPAID"
    PARTIAL = "PARTIAL"
    PAID = "PAID"
    REFUNDED = "REFUNDED"

class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_reference: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    guest_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    hotel_id: Mapped[str] = mapped_column(String(36), ForeignKey("hotels.id", ondelete="CASCADE"), nullable=False)
    room_id: Mapped[str] = mapped_column(String(36), ForeignKey("rooms.id", ondelete="SET NULL"), nullable=True)
    
    check_in_date: Mapped[date] = mapped_column(Date, nullable=False)
    check_out_date: Mapped[date] = mapped_column(Date, nullable=False)
    adults: Mapped[int] = mapped_column(Integer, default=2)
    children: Mapped[int] = mapped_column(Integer, default=0)
    
    base_amount: Mapped[float] = mapped_column(Float, nullable=False)
    tax_amount: Mapped[float] = mapped_column(Float, default=0.0)
    discount_amount: Mapped[float] = mapped_column(Float, default=0.0)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    
    status: Mapped[BookingStatus] = mapped_column(SQLEnum(BookingStatus), default=BookingStatus.CONFIRMED, nullable=False)
    payment_status: Mapped[PaymentStatus] = mapped_column(SQLEnum(PaymentStatus), default=PaymentStatus.PAID, nullable=False)
    booking_source: Mapped[BookingSource] = mapped_column(SQLEnum(BookingSource), default=BookingSource.WEBSITE, nullable=False)
    special_requests: Mapped[str] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    guest = relationship("User", back_populates="bookings", foreign_keys="[Booking.guest_id]")
    hotel = relationship("Hotel", back_populates="bookings")
    room = relationship("Room", back_populates="bookings")
    payments = relationship("Payment", back_populates="booking", cascade="all, delete-orphan")
    guest_requests = relationship("GuestRequest", back_populates="booking")
    reviews = relationship("Review", back_populates="booking")
