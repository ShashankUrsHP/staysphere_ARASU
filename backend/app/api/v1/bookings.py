import uuid
import random
from typing import List, Optional
from datetime import date, datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.booking import Booking, BookingStatus, BookingSource, PaymentStatus
from app.models.room import Room, RoomType, RoomStatus
from app.models.payment import Payment, PaymentMethod, PaymentTransactionStatus
from app.models.housekeeping import HousekeepingTask, HousekeepingTaskType, TaskPriority, TaskStatus
from app.models.notification import Notification
from app.models.audit_log import AuditLog
from app.models.user import User, UserRole
from app.schemas.booking import (
    BookingCreate,
    BookingResponse,
    BookingStatusUpdate,
    InvoiceResponse
)
from app.api.deps import get_current_user, require_role, get_current_user_optional

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    req: BookingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if req.check_in_date >= req.check_out_date:
        raise HTTPException(
            status_code=400,
            detail="check_out_date must be strictly after check_in_date"
        )
    
    # 1. Fetch room type
    rt_res = await db.execute(select(RoomType).where(RoomType.id == req.room_type_id))
    room_type = rt_res.scalar_one_or_none()
    if not room_type:
        raise HTTPException(status_code=404, detail="Room type not found")
    
    # 2. Lock / find available room of this type for the specified date range
    # Find all rooms of this type
    all_rooms_res = await db.execute(
        select(Room).where(
            and_(
                Room.room_type_id == req.room_type_id,
                Room.status != RoomStatus.OUT_OF_SERVICE
            )
        )
    )
    all_rooms = all_rooms_res.scalars().all()
    if not all_rooms:
        raise HTTPException(
            status_code=400,
            detail="No operational rooms available for this room type"
        )
    
    # Find overlapping booked room IDs
    overlap_query = select(Booking.room_id).where(
        and_(
            Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN, BookingStatus.PENDING]),
            Booking.check_in_date < req.check_out_date,
            Booking.check_out_date > req.check_in_date,
            Booking.room_id.isnot(None)
        )
    )
    booked_ids_res = await db.execute(overlap_query)
    booked_room_ids = set(booked_ids_res.scalars().all())

    available_room = None
    for r in all_rooms:
        if r.id not in booked_room_ids:
            available_room = r
            break

    if not available_room:
        raise HTTPException(
            status_code=400,
            detail="Selected room type is fully booked for the requested dates. Please choose another room type or dates."
        )

    # 3. Calculate backend price
    nights = (req.check_out_date - req.check_in_date).days
    base_amount = float(room_type.base_price) * nights
    
    discount_amount = 0.0
    if req.discount_code and req.discount_code.upper() in ["LUXURY10", "WELCOME10"]:
        discount_amount = round(base_amount * 0.1, 2)

    taxable = base_amount - discount_amount
    tax_amount = round(taxable * 0.18, 2) # 18% GST standard in India
    total_amount = taxable + tax_amount

    booking_ref = f"STY-{random.randint(10000, 99999)}"

    # Determine guest ID
    guest_id = current_user.id if current_user else "guest-anonymous"
    if guest_id == "guest-anonymous":
        # Fallback to demo guest if not authenticated
        guest_res = await db.execute(select(User).where(User.role == UserRole.GUEST))
        first_guest = guest_res.scalars().first()
        if first_guest:
            guest_id = first_guest.id

    new_booking = Booking(
        booking_reference=booking_ref,
        guest_id=guest_id,
        hotel_id=req.hotel_id,
        room_id=available_room.id,
        check_in_date=req.check_in_date,
        check_out_date=req.check_out_date,
        adults=req.adults,
        children=req.children,
        base_amount=base_amount,
        tax_amount=tax_amount,
        discount_amount=discount_amount,
        total_amount=total_amount,
        status=BookingStatus.CONFIRMED,
        payment_status=PaymentStatus.PAID if req.payment_method != "pay_at_hotel" else PaymentStatus.PENDING,
        booking_source=BookingSource.DIRECT,
        special_requests=req.special_requests
    )

    db.add(new_booking)
    await db.flush()

    # Reserve the room
    available_room.status = RoomStatus.RESERVED
    
    # Create notification
    notif = Notification(
        user_id=guest_id,
        title="Booking Confirmed",
        message=f"Your reservation ({booking_ref}) for {room_type.name} from {req.check_in_date} to {req.check_out_date} is confirmed!",
        type="SUCCESS"
    )
    db.add(notif)

    # Create audit log
    audit = AuditLog(
        user_id=guest_id,
        action="BOOKING_CREATED",
        entity_type="Booking",
        entity_id=new_booking.id,
        new_value=f"Ref: {booking_ref}, Room: {available_room.room_number}, Total: ₹{total_amount}"
    )
    db.add(audit)

    await db.commit()
    
    # Reload with relationships
    res = await db.execute(
        select(Booking)
        .where(Booking.id == new_booking.id)
        .options(selectinload(Booking.room).selectinload(Room.room_type), selectinload(Booking.guest))
    )
    return res.scalar_one()

@router.get("", response_model=List[BookingResponse])
async def list_bookings(
    status: Optional[BookingStatus] = None,
    guest_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Booking).options(
        selectinload(Booking.room).selectinload(Room.room_type),
        selectinload(Booking.guest)
    )

    if current_user.role == UserRole.GUEST:
        query = query.where(Booking.guest_id == current_user.id)
    elif guest_id:
        query = query.where(Booking.guest_id == guest_id)
        
    if status:
        query = query.where(Booking.status == status)

    query = query.order_by(Booking.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{id}", response_model=BookingResponse)
async def get_booking(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Booking)
        .where(Booking.id == id)
        .options(selectinload(Booking.room).selectinload(Room.room_type), selectinload(Booking.guest))
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.post("/{id}/cancel", response_model=BookingResponse)
async def cancel_booking(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Booking)
        .where(Booking.id == id)
        .options(selectinload(Booking.room))
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.status in [BookingStatus.CHECKED_OUT, BookingStatus.CANCELLED]:
        raise HTTPException(status_code=400, detail=f"Cannot cancel booking with status {booking.status}")

    booking.status = BookingStatus.CANCELLED
    if booking.room:
        booking.room.status = RoomStatus.AVAILABLE

    notif = Notification(
        user_id=booking.guest_id,
        title="Booking Cancelled",
        message=f"Booking {booking.booking_reference} has been cancelled successfully.",
        type="WARNING"
    )
    db.add(notif)
    await db.commit()

    res = await db.execute(
        select(Booking)
        .where(Booking.id == id)
        .options(selectinload(Booking.room).selectinload(Room.room_type), selectinload(Booking.guest))
    )
    return res.scalar_one()

@router.post("/{id}/check-in", response_model=BookingResponse)
async def check_in_booking(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.STAFF, UserRole.ADMIN]))
):
    result = await db.execute(
        select(Booking)
        .where(Booking.id == id)
        .options(selectinload(Booking.room))
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.status != BookingStatus.CONFIRMED:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot check in booking with status {booking.status}. Must be CONFIRMED."
        )

    booking.status = BookingStatus.CHECKED_IN
    if booking.room:
        booking.room.status = RoomStatus.OCCUPIED
        booking.room.current_guest_id = booking.guest_id

    notif = Notification(
        user_id=booking.guest_id,
        title="Welcome to StaySphere!",
        message=f"You have successfully checked into Room {booking.room.room_number if booking.room else ''}. Enjoy your stay!",
        type="SUCCESS"
    )
    db.add(notif)
    await db.commit()

    res = await db.execute(
        select(Booking)
        .where(Booking.id == id)
        .options(selectinload(Booking.room).selectinload(Room.room_type), selectinload(Booking.guest))
    )
    return res.scalar_one()

@router.post("/{id}/check-out", response_model=BookingResponse)
async def check_out_booking(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.STAFF, UserRole.ADMIN]))
):
    result = await db.execute(
        select(Booking)
        .where(Booking.id == id)
        .options(selectinload(Booking.room))
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.status != BookingStatus.CHECKED_IN:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot check out booking with status {booking.status}. Must be CHECKED_IN."
        )

    booking.status = BookingStatus.CHECKED_OUT
    if booking.room:
        room_id = booking.room.id
        booking.room.status = RoomStatus.CLEANING
        booking.room.current_guest_id = None

        # Automatically create housekeeping task for checkout cleaning
        hk_task = HousekeepingTask(
            room_id=room_id,
            task_type=HousekeepingTaskType.CHECKOUT_CLEANING,
            priority=TaskPriority.HIGH,
            status=TaskStatus.PENDING,
            description=f"Automated Checkout Cleaning for Room {booking.room.room_number} after guest checkout."
        )
        db.add(hk_task)

    notif = Notification(
        user_id=booking.guest_id,
        title="Thank you for staying with us!",
        message=f"Check-out complete for booking {booking.booking_reference}. Your final invoice is ready for download.",
        type="INFO"
    )
    db.add(notif)
    await db.commit()

    res = await db.execute(
        select(Booking)
        .where(Booking.id == id)
        .options(selectinload(Booking.room).selectinload(Room.room_type), selectinload(Booking.guest))
    )
    return res.scalar_one()

@router.get("/{id}/invoice", response_model=InvoiceResponse)
async def get_booking_invoice(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(
        select(Booking)
        .where(Booking.id == id)
        .options(
            selectinload(Booking.room).selectinload(Room.room_type),
            selectinload(Booking.guest),
            selectinload(Booking.hotel)
        )
    )
    booking = res.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    nights = max(1, (booking.check_out_date - booking.check_in_date).days)
    rate_per_night = booking.base_amount / nights

    return InvoiceResponse(
        invoice_number=f"INV-{booking.booking_reference}",
        booking_reference=booking.booking_reference,
        guest_name=booking.guest.full_name if booking.guest else "Guest",
        guest_email=booking.guest.email if booking.guest else "guest@staysphere.com",
        hotel_name=booking.hotel.name if booking.hotel else "StaySphere Grand Bengaluru",
        room_number=booking.room.room_number if booking.room else "N/A",
        check_in_date=booking.check_in_date,
        check_out_date=booking.check_out_date,
        nights=nights,
        room_rate_per_night=rate_per_night,
        base_amount=booking.base_amount,
        restaurant_charges=0.0,
        discount_amount=booking.discount_amount,
        tax_amount=booking.tax_amount,
        grand_total=booking.total_amount,
        payment_status=booking.payment_status.value,
        created_at=booking.created_at
    )
