import enum
from datetime import datetime, timezone
import uuid
from sqlalchemy import String, Integer, Float, Text, DateTime, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class RoomStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"
    OCCUPIED = "OCCUPIED"
    CLEANING = "CLEANING"
    MAINTENANCE = "MAINTENANCE"
    OUT_OF_SERVICE = "OUT_OF_SERVICE"

class RoomType(Base):
    __tablename__ = "room_types"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hotel_id: Mapped[str] = mapped_column(String(36), ForeignKey("hotels.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="Rooms") # Rooms, Suites, Villas
    tagline: Mapped[str] = mapped_column(String(255), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    capacity: Mapped[int] = mapped_column(Integer, default=2)
    base_price: Mapped[float] = mapped_column(Float, nullable=False)
    size_sqft: Mapped[int] = mapped_column(Integer, default=400)
    bed_type: Mapped[str] = mapped_column(String(50), default="King Bed")
    view_type: Mapped[str] = mapped_column(String(100), default="City View")
    amenities: Mapped[list] = mapped_column(JSON, default=list) # stored as JSON array
    images: Mapped[list] = mapped_column(JSON, default=list) # stored as JSON array of URLs
    rating: Mapped[float] = mapped_column(Float, default=4.9)
    review_count: Mapped[int] = mapped_column(Integer, default=50)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    hotel = relationship("Hotel", back_populates="room_types")
    rooms = relationship("Room", back_populates="room_type", cascade="all, delete-orphan")

class Room(Base):
    __tablename__ = "rooms"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hotel_id: Mapped[str] = mapped_column(String(36), ForeignKey("hotels.id", ondelete="CASCADE"), nullable=False)
    room_type_id: Mapped[str] = mapped_column(String(36), ForeignKey("room_types.id", ondelete="CASCADE"), nullable=False)
    room_number: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    floor: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[RoomStatus] = mapped_column(SQLEnum(RoomStatus), default=RoomStatus.AVAILABLE, nullable=False)
    current_guest_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    hotel = relationship("Hotel", back_populates="rooms")
    room_type = relationship("RoomType", back_populates="rooms")
    current_guest = relationship("User", foreign_keys="[Room.current_guest_id]")
    bookings = relationship("Booking", back_populates="room")
    housekeeping_tasks = relationship("HousekeepingTask", back_populates="room")
    maintenance_requests = relationship("MaintenanceRequest", back_populates="room")
    guest_requests = relationship("GuestRequest", back_populates="room")
