import enum
from datetime import datetime, timezone
import uuid
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class MaintenanceIssueType(str, enum.Enum):
    PLUMBING = "PLUMBING"
    ELECTRICAL = "ELECTRICAL"
    HVAC_CLIMATE = "HVAC_CLIMATE"
    FURNITURE = "FURNITURE"
    APPLIANCE = "APPLIANCE"
    OTHER = "OTHER"

class MaintenancePriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class MaintenanceStatus(str, enum.Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    room_id: Mapped[str] = mapped_column(String(36), ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    reported_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    assigned_staff_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    issue_type: Mapped[MaintenanceIssueType] = mapped_column(SQLEnum(MaintenanceIssueType), default=MaintenanceIssueType.HVAC_CLIMATE, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    priority: Mapped[MaintenancePriority] = mapped_column(SQLEnum(MaintenancePriority), default=MaintenancePriority.MEDIUM, nullable=False)
    status: Mapped[MaintenanceStatus] = mapped_column(SQLEnum(MaintenanceStatus), default=MaintenanceStatus.PENDING, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    resolved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    room = relationship("Room", back_populates="maintenance_requests")
    reporter = relationship("User", foreign_keys="[MaintenanceRequest.reported_by]")
    assigned_staff = relationship("User", foreign_keys="[MaintenanceRequest.assigned_staff_id]")
