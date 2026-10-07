from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.room import Room, RoomType, RoomStatus
from app.models.booking import Booking, BookingStatus
from app.schemas.room import (
    RoomResponse,
    RoomTypeResponse,
    AvailableRoomTypeResponse,
    RoomUpdateStatus
)
from app.models.user import UserRole, User
from app.api.deps import require_role, get_current_user

router = APIRouter(prefix="/rooms", tags=["Rooms"])

@router.get("/types", response_model=List[RoomTypeResponse])
async def list_room_types(
    hotel_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(RoomType)
    if hotel_id:
        query = query.where(RoomType.hotel_id == hotel_id)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("", response_model=List[RoomResponse])
async def list_rooms(
    hotel_id: Optional[str] = None,
    room_type_id: Optional[str] = None,
    status: Optional[RoomStatus] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Room).options(selectinload(Room.room_type))
    if hotel_id:
        query = query.where(Room.hotel_id == hotel_id)
    if room_type_id:
        query = query.where(Room.room_type_id == room_type_id)
    if status:
        query = query.where(Room.status == status)
    
    query = query.order_by(Room.room_number)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/availability", response_model=List[AvailableRoomTypeResponse])
async def check_room_availability(
    check_in: date = Query(...),
    check_out: date = Query(...),
    adults: int = Query(1, ge=1),
    children: int = Query(0, ge=0),
    hotel_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    if check_in >= check_out:
        raise HTTPException(
            status_code=400,
            detail="check_out date must be strictly after check_in date"
        )
    
    total_guests = adults + children

    # Get all room types matching guest capacity
    rt_query = select(RoomType).where(RoomType.capacity >= total_guests)
    if hotel_id:
        rt_query = rt_query.where(RoomType.hotel_id == hotel_id)
    
    rt_result = await db.execute(rt_query)
    room_types = rt_result.scalars().all()

    # Find room IDs that are booked in overlapping range
    # Overlap occurs when: booking.check_in_date < search.check_out_date AND booking.check_out_date > search.check_in_date
    overlapping_bookings_query = select(Booking.room_id).where(
        and_(
            Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN, BookingStatus.PENDING]),
            Booking.check_in_date < check_out,
            Booking.check_out_date > check_in,
            Booking.room_id.isnot(None)
        )
    )
    booked_room_ids_res = await db.execute(overlapping_bookings_query)
    booked_room_ids = set(booked_room_ids_res.scalars().all())

    availability_list = []

    for rt in room_types:
        # Get total rooms for this room_type that are not OUT_OF_SERVICE
        rooms_query = select(Room).where(
            and_(
                Room.room_type_id == rt.id,
                Room.status != RoomStatus.OUT_OF_SERVICE
            )
        )
        rooms_res = await db.execute(rooms_query)
        rooms = rooms_res.scalars().all()
        
        total_inv = len(rooms)
        available_count = sum(1 for r in rooms if r.id not in booked_room_ids and r.status in [RoomStatus.AVAILABLE, RoomStatus.CLEANING])

        availability_list.append(
            AvailableRoomTypeResponse(
                room_type=RoomTypeResponse.model_validate(rt),
                total_inventory=total_inv,
                available_count=max(0, available_count),
                price_per_night=float(rt.base_price)
            )
        )

    return availability_list

@router.put("/{id}/status", response_model=RoomResponse)
async def update_room_status(
    id: str,
    status_update: RoomUpdateStatus,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.STAFF, UserRole.ADMIN]))
):
    result = await db.execute(select(Room).where(Room.id == id).options(selectinload(Room.room_type)))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    room.status = status_update.status
    await db.commit()
    await db.refresh(room)
    return room
