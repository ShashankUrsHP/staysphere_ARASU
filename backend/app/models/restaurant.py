import enum
from datetime import datetime, timezone
import uuid
from sqlalchemy import String, Integer, Float, Text, DateTime, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class RestaurantOrderStatus(str, enum.Enum):
    PLACED = "PLACED"
    CONFIRMED = "CONFIRMED"
    PREPARING = "PREPARING"
    READY = "READY"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class MenuCategory(Base):
    __tablename__ = "menu_categories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    items = relationship("MenuItem", back_populates="category_rel", cascade="all, delete-orphan")

class MenuItem(Base):
    __tablename__ = "menu_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category_id: Mapped[str] = mapped_column(String(36), ForeignKey("menu_categories.id", ondelete="SET NULL"), nullable=True)
    category_name: Mapped[str] = mapped_column(String(50), default="Dinner") # Breakfast, Lunch, Dinner, Drinks, Desserts
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    image: Mapped[str] = mapped_column(String(500), nullable=True)
    dietary: Mapped[list] = mapped_column(JSON, default=list) # Array of tags like 'Vegan', 'Gluten-Free'
    prep_time: Mapped[str] = mapped_column(String(20), default="20 min")
    is_available: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    category_rel = relationship("MenuCategory", back_populates="items")

class RestaurantOrder(Base):
    __tablename__ = "restaurant_orders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_number: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    guest_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    room_number: Mapped[str] = mapped_column(String(20), nullable=False)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[RestaurantOrderStatus] = mapped_column(SQLEnum(RestaurantOrderStatus), default=RestaurantOrderStatus.PLACED, nullable=False)
    special_instructions: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    guest = relationship("User", foreign_keys="[RestaurantOrder.guest_id]")
    order_items = relationship("RestaurantOrderItem", back_populates="order", cascade="all, delete-orphan")

class RestaurantOrderItem(Base):
    __tablename__ = "restaurant_order_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id: Mapped[str] = mapped_column(String(36), ForeignKey("restaurant_orders.id", ondelete="CASCADE"), nullable=False)
    menu_item_id: Mapped[str] = mapped_column(String(36), ForeignKey("menu_items.id", ondelete="CASCADE"), nullable=False)
    item_name: Mapped[str] = mapped_column(String(100), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    unit_price: Mapped[float] = mapped_column(Float, nullable=False)
    total_price: Mapped[float] = mapped_column(Float, nullable=False)

    order = relationship("RestaurantOrder", back_populates="order_items")
    menu_item = relationship("MenuItem")
