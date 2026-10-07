from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.maintenance import MaintenanceRequest, MaintenanceStatus, MaintenancePriority
from app.models.room import Room, RoomStatus
from app.schemas.maintenance import MaintenanceCreate, MaintenanceResponse, MaintenanceStatusUpdate
from app.models.user import UserRole, User
from app.api.deps import require_role, get_current_user

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

@router.get("", response_model=List[MaintenanceResponse])
async def list_maintenance_requests(
    status: Optional[MaintenanceStatus] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.STAFF, UserRole.ADMIN]))
):
    query = select(MaintenanceRequest).options(
        selectinload(MaintenanceRequest.room).selectinload(Room.room_type),
        selectinload(MaintenanceRequest.reporter),
        selectinload(MaintenanceRequest.assigned_staff)
    )
    if status:
        query = query.where(MaintenanceRequest.status == status)
    
    query = query.order_by(MaintenanceRequest.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.post("", response_model=MaintenanceResponse, status_code=status.HTTP_201_CREATED)
async def create_maintenance_request(
    req: MaintenanceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    room_res = await db.execute(select(Room).where(Room.id == req.room_id))
    room = room_res.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    request = MaintenanceRequest(
        room_id=req.room_id,
        reported_by=current_user.id,
        issue_type=req.issue_type,
        description=req.description,
        priority=req.priority,
        status=MaintenanceStatus.PENDING,
        assigned_staff_id=req.assigned_staff_id
    )
    db.add(request)
    
    # Mark room status as MAINTENANCE if not occupied
    if room.status != RoomStatus.OCCUPIED:
        room.status = RoomStatus.MAINTENANCE

    await db.commit()

    res = await db.execute(
        select(MaintenanceRequest)
        .where(MaintenanceRequest.id == request.id)
        .options(selectinload(MaintenanceRequest.room).selectinload(Room.room_type), selectinload(MaintenanceRequest.reporter), selectinload(MaintenanceRequest.assigned_staff))
    )
    return res.scalar_one()

@router.put("/{id}/status", response_model=MaintenanceResponse)
async def update_maintenance_status(
    id: str,
    req: MaintenanceStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.STAFF, UserRole.ADMIN]))
):
    req_res = await db.execute(
        select(MaintenanceRequest)
        .where(MaintenanceRequest.id == id)
        .options(selectinload(MaintenanceRequest.room))
    )
    maint = req_res.scalar_one_or_none()
    if not maint:
        raise HTTPException(status_code=404, detail="Maintenance request not found")

    maint.status = req.status
    if req.assigned_staff_id:
        maint.assigned_staff_id = req.assigned_staff_id

    if req.status == MaintenanceStatus.RESOLVED:
        maint.resolved_at = datetime.now(timezone.utc)
        if maint.room and maint.room.status == RoomStatus.MAINTENANCE:
            maint.room.status = RoomStatus.AVAILABLE

    await db.commit()

    res = await db.execute(
        select(MaintenanceRequest)
        .where(MaintenanceRequest.id == id)
        .options(selectinload(MaintenanceRequest.room).selectinload(Room.room_type), selectinload(MaintenanceRequest.reporter), selectinload(MaintenanceRequest.assigned_staff))
    )
    return res.scalar_one()
