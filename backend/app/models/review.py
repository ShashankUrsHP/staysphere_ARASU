from datetime import datetime, timezone
import uuid
from sqlalchemy import String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    guest_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    hotel_id: Mapped[str] = mapped_column(String(36), ForeignKey("hotels.id", ondelete="CASCADE"), nullable=False)
    booking_id: Mapped[str] = mapped_column(String(36), ForeignKey("bookings.id", ondelete="SET NULL"), nullable=True)
    
    rating: Mapped[int] = mapped_column(Integer, nullable=False) # 1 to 5 stars
    title: Mapped[str] = mapped_column(String(150), nullable=True)
    comment: Mapped[str] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    guest = relationship("User", back_populates="reviews")
    hotel = relationship("Hotel", back_populates="reviews")
    booking = relationship("Booking", back_populates="reviews")
