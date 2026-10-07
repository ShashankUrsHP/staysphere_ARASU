import enum
from datetime import datetime, timezone
import uuid
from sqlalchemy import String, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class UserRole(str, enum.Enum):
    GUEST = "GUEST"
    STAFF = "STAFF"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(30), nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole), default=UserRole.GUEST, nullable=False)
    avatar_url: Mapped[str] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    bookings = relationship("Booking", back_populates="guest", foreign_keys="[Booking.guest_id]")
    guest_requests = relationship("GuestRequest", back_populates="guest", foreign_keys="[GuestRequest.guest_id]")
    notifications = relationship("Notification", back_populates="user")
    reviews = relationship("Review", back_populates="guest")
