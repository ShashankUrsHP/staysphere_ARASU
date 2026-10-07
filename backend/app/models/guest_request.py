import enum
from datetime import datetime, timezone
import uuid
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class GuestRequestType(str, enum.Enum):
    HOUSEKEEPING = "HOUSEKEEPING"
    ROOM_SERVICE = "ROOM_SERVICE"
    MAINTENANCE = "MAINTENANCE"
    EXTRA_TOWELS = "EXTRA_TOWELS"
    AMENITIES = "AMENITIES"
    LATE_CHECKOUT = "LATE_CHECKOUT"
    WAKE_UP_CALL = "WAKE_UP_CALL"
    OTHER = "OTHER"

class GuestRequestStatus(str, enum.Enum):
    REQUESTED = "REQUESTED"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"

class GuestRequest(Base):
    __tablename__ = "guest_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    guest_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    room_id: Mapped[str] = mapped_column(String(36), ForeignKey("rooms.id", ondelete="SET NULL"), nullable=True)
    booking_id: Mapped[str] = mapped_column(String(36), ForeignKey("bookings.id", ondelete="SET NULL"), nullable=True)
    
    request_type: Mapped[GuestRequestType] = mapped_column(SQLEnum(GuestRequestType), default=GuestRequestType.HOUSEKEEPING, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    priority: Mapped[str] = mapped_column(String(20), default="MEDIUM")
    status: Mapped[GuestRequestStatus] = mapped_column(SQLEnum(GuestRequestStatus), default=GuestRequestStatus.REQUESTED, nullable=False)
    assigned_staff_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    guest = relationship("User", foreign_keys="[GuestRequest.guest_id]", back_populates="guest_requests")
    room = relationship("Room", back_populates="guest_requests")
    booking = relationship("Booking", back_populates="guest_requests")
    assigned_staff = relationship("User", foreign_keys="[GuestRequest.assigned_staff_id]")
