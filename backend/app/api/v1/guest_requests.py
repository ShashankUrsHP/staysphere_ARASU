from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.guest_request import GuestRequest, GuestRequestStatus, GuestRequestType
from app.models.room import Room
from app.models.booking import Booking, BookingStatus
from app.models.notification import Notification
from app.schemas.guest_request import GuestRequestCreate, GuestRequestResponse, GuestRequestStatusUpdate
from app.models.user import UserRole, User
from app.api.deps import require_role, get_current_user

router = APIRouter(prefix="/guest-requests", tags=["Guest Requests"])

@router.get("", response_model=List[GuestRequestResponse])
async def list_guest_requests(
    status: Optional[GuestRequestStatus] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(GuestRequest).options(
        selectinload(GuestRequest.guest),
        selectinload(GuestRequest.room).selectinload(Room.room_type),
        selectinload(GuestRequest.assigned_staff)
    )

    if current_user.role == UserRole.GUEST:
        query = query.where(GuestRequest.guest_id == current_user.id)
    if status:
        query = query.where(GuestRequest.status == status)

    query = query.order_by(GuestRequest.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.post("", response_model=GuestRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_guest_request(
    req: GuestRequestCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    room_id = None
    booking_id = None

    # Find guest's active booking if room_number provided or check active booking
    if req.room_number:
        room_res = await db.execute(select(Room).where(Room.room_number == req.room_number))
        room = room_res.scalar_one_or_none()
        if room:
            room_id = room.id
    
    if not room_id:
        # Find guest checked in booking
        booking_res = await db.execute(
            select(Booking).where(
                Booking.guest_id == current_user.id,
                Booking.status == BookingStatus.CHECKED_IN
            )
        )
        active_booking = booking_res.scalars().first()
        if active_booking:
            booking_id = active_booking.id
            room_id = active_booking.room_id

    g_request = GuestRequest(
        guest_id=current_user.id,
        room_id=room_id,
        booking_id=booking_id,
        request_type=req.request_type,
        description=req.description,
        priority=req.priority,
        status=GuestRequestStatus.REQUESTED
    )
    db.add(g_request)

    # Create notification for staff
    notif = Notification(
        user_id=current_user.id,
        title="Service Request Received",
        message=f"Your request for '{req.request_type.value.replace('_', ' ')}' has been submitted and assigned to staff.",
        type="INFO"
    )
    db.add(notif)

    await db.commit()

    res = await db.execute(
        select(GuestRequest)
        .where(GuestRequest.id == g_request.id)
        .options(selectinload(GuestRequest.guest), selectinload(GuestRequest.room).selectinload(Room.room_type), selectinload(GuestRequest.assigned_staff))
    )
    return res.scalar_one()

@router.put("/{id}/status", response_model=GuestRequestResponse)
async def update_guest_request_status(
    id: str,
    req: GuestRequestStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.STAFF, UserRole.ADMIN]))
):
    res = await db.execute(select(GuestRequest).where(GuestRequest.id == id))
    g_req = res.scalar_one_or_none()
    if not g_req:
        raise HTTPException(status_code=404, detail="Guest request not found")

    g_req.status = req.status
    if req.assigned_staff_id:
        g_req.assigned_staff_id = req.assigned_staff_id
    elif not g_req.assigned_staff_id:
        g_req.assigned_staff_id = current_user.id

    if req.status == GuestRequestStatus.COMPLETED:
        g_req.completed_at = datetime.now(timezone.utc)
        notif = Notification(
            user_id=g_req.guest_id,
            title="Service Request Completed",
            message=f"Your request '{g_req.request_type.value}' has been completed by staff.",
            type="SUCCESS"
        )
        db.add(notif)

    await db.commit()

    out = await db.execute(
        select(GuestRequest)
        .where(GuestRequest.id == id)
        .options(selectinload(GuestRequest.guest), selectinload(GuestRequest.room).selectinload(Room.room_type), selectinload(GuestRequest.assigned_staff))
    )
    return out.scalar_one()
