import enum
from datetime import datetime, timezone
import uuid
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class HousekeepingTaskType(str, enum.Enum):
    CHECKOUT_CLEANING = "CHECKOUT_CLEANING"
    ROOM_CLEANING = "ROOM_CLEANING"
    DEEP_CLEANING = "DEEP_CLEANING"
    LINEN_CHANGE = "LINEN_CHANGE"
    TURNDOWN = "TURNDOWN"
    AMENITY_RESTOCK = "AMENITY_RESTOCK"

class TaskPriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class TaskStatus(str, enum.Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"

class HousekeepingTask(Base):
    __tablename__ = "housekeeping_tasks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    room_id: Mapped[str] = mapped_column(String(36), ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    assigned_staff_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    task_type: Mapped[HousekeepingTaskType] = mapped_column(SQLEnum(HousekeepingTaskType), default=HousekeepingTaskType.ROOM_CLEANING, nullable=False)
    priority: Mapped[TaskPriority] = mapped_column(SQLEnum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False)
    status: Mapped[TaskStatus] = mapped_column(SQLEnum(TaskStatus), default=TaskStatus.PENDING, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    room = relationship("Room", back_populates="housekeeping_tasks")
    assigned_staff = relationship("User", foreign_keys="[HousekeepingTask.assigned_staff_id]")
