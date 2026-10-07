import random
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.restaurant import (
    MenuCategory,
    MenuItem,
    RestaurantOrder,
    RestaurantOrderItem,
    RestaurantOrderStatus
)
from app.models.room import Room
from app.models.notification import Notification
from app.schemas.restaurant import (
    MenuCategoryResponse,
    MenuItemResponse,
    OrderCreate,
    OrderResponse,
    OrderStatusUpdate
)
from app.models.user import UserRole, User
from app.api.deps import require_role, get_current_user

router = APIRouter(prefix="/restaurant", tags=["Restaurant"])

@router.get("/categories", response_model=List[MenuCategoryResponse])
async def list_menu_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MenuCategory).order_by(MenuCategory.display_order))
    return result.scalars().all()

@router.get("/menu", response_model=List[MenuItemResponse])
async def list_menu_items(
    category_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(MenuItem).where(MenuItem.is_available == True)
    if category_id:
        query = query.where(MenuItem.category_id == category_id)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/orders", response_model=List[OrderResponse])
async def list_restaurant_orders(
    status: Optional[RestaurantOrderStatus] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(RestaurantOrder).options(
        selectinload(RestaurantOrder.items).selectinload(RestaurantOrderItem.menu_item)
    )

    if current_user.role == UserRole.GUEST:
        query = query.where(RestaurantOrder.guest_id == current_user.id)
    if status:
        query = query.where(RestaurantOrder.status == status)

    query = query.order_by(RestaurantOrder.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def place_restaurant_order(
    req: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not req.items:
        raise HTTPException(status_code=400, detail="Cart cannot be empty")

    room_res = await db.execute(select(Room).where(Room.room_number == req.room_number))
    room = room_res.scalar_one_or_none()

    order_ref = f"ORD-{random.randint(10000, 99999)}"
    
    total_amount = 0.0
    order_items_to_add = []

    for item_in in req.items:
        mi_res = await db.execute(select(MenuItem).where(MenuItem.id == item_in.menu_item_id))
        menu_item = mi_res.scalar_one_or_none()
        if not menu_item:
            raise HTTPException(status_code=404, detail=f"Menu item {item_in.menu_item_id} not found")
        
        unit_price = float(menu_item.price)
        item_total = unit_price * item_in.quantity
        total_amount += item_total

        order_item = RestaurantOrderItem(
            menu_item_id=menu_item.id,
            quantity=item_in.quantity,
            unit_price=unit_price,
            total_price=item_total,
            instructions=item_in.instructions
        )
        order_items_to_add.append(order_item)

    order = RestaurantOrder(
        order_reference=order_ref,
        guest_id=current_user.id,
        room_id=room.id if room else None,
        room_number=req.room_number,
        total_amount=total_amount,
        status=RestaurantOrderStatus.PLACED,
        special_notes=req.special_notes,
        items=order_items_to_add
    )
    db.add(order)

    notif = Notification(
        user_id=current_user.id,
        title="Restaurant Order Received",
        message=f"Order {order_ref} placed for Room {req.room_number}. Estimated delivery: 25 mins.",
        type="INFO"
    )
    db.add(notif)

    await db.commit()

    res = await db.execute(
        select(RestaurantOrder)
        .where(RestaurantOrder.id == order.id)
        .options(selectinload(RestaurantOrder.items).selectinload(RestaurantOrderItem.menu_item))
    )
    return res.scalar_one()

@router.put("/orders/{id}/status", response_model=OrderResponse)
async def update_order_status(
    id: str,
    req: OrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.STAFF, UserRole.ADMIN]))
):
    res = await db.execute(select(RestaurantOrder).where(RestaurantOrder.id == id))
    order = res.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Restaurant order not found")

    order.status = req.status

    if req.status == RestaurantOrderStatus.DELIVERED:
        notif = Notification(
            user_id=order.guest_id,
            title="Order Delivered",
            message=f"Your restaurant order {order.order_reference} has been delivered to Room {order.room_number}. Bon appétit!",
            type="SUCCESS"
        )
        db.add(notif)

    await db.commit()

    out = await db.execute(
        select(RestaurantOrder)
        .where(RestaurantOrder.id == id)
        .options(selectinload(RestaurantOrder.items).selectinload(RestaurantOrderItem.menu_item))
    )
    return out.scalar_one()
