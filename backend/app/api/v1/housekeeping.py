from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.housekeeping import HousekeepingTask, TaskStatus, TaskPriority, HousekeepingTaskType
from app.models.room import Room, RoomStatus
from app.models.maintenance import MaintenanceRequest, MaintenanceStatus
from app.schemas.housekeeping import HousekeepingCreate, HousekeepingResponse, HousekeepingStatusUpdate
from app.models.user import UserRole, User
from app.api.deps import require_role, get_current_user

router = APIRouter(prefix="/housekeeping", tags=["Housekeeping"])

@router.get("", response_model=List[HousekeepingResponse])
async def list_housekeeping_tasks(
    status: Optional[TaskStatus] = None,
    assigned_staff_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.STAFF, UserRole.ADMIN]))
):
    query = select(HousekeepingTask).options(
        selectinload(HousekeepingTask.room).selectinload(Room.room_type),
        selectinload(HousekeepingTask.assigned_staff)
    )
    if status:
        query = query.where(HousekeepingTask.status == status)
    if assigned_staff_id:
        query = query.where(HousekeepingTask.assigned_staff_id == assigned_staff_id)
    
    query = query.order_by(HousekeepingTask.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.post("", response_model=HousekeepingResponse, status_code=status.HTTP_201_CREATED)
async def create_housekeeping_task(
    req: HousekeepingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.STAFF, UserRole.ADMIN]))
):
    # Verify room
    room_res = await db.execute(select(Room).where(Room.id == req.room_id))
    room = room_res.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    task = HousekeepingTask(
        room_id=req.room_id,
        task_type=req.task_type,
        priority=req.priority,
        status=TaskStatus.PENDING,
        description=req.description,
        assigned_staff_id=req.assigned_staff_id or current_user.id
    )
    db.add(task)
    
    if room.status == RoomStatus.AVAILABLE:
        room.status = RoomStatus.CLEANING

    await db.commit()

    res = await db.execute(
        select(HousekeepingTask)
        .where(HousekeepingTask.id == task.id)
        .options(selectinload(HousekeepingTask.room).selectinload(Room.room_type), selectinload(HousekeepingTask.assigned_staff))
    )
    return res.scalar_one()

@router.put("/{id}/status", response_model=HousekeepingResponse)
async def update_housekeeping_task_status(
    id: str,
    req: HousekeepingStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.STAFF, UserRole.ADMIN]))
):
    task_res = await db.execute(
        select(HousekeepingTask)
        .where(HousekeepingTask.id == id)
        .options(selectinload(HousekeepingTask.room))
    )
    task = task_res.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Housekeeping task not found")

    now = datetime.now(timezone.utc)
    task.status = req.status
    if req.assigned_staff_id:
        task.assigned_staff_id = req.assigned_staff_id

    if req.status == TaskStatus.IN_PROGRESS and not task.started_at:
        task.started_at = now
    elif req.status == TaskStatus.COMPLETED:
        task.completed_at = now
        
        # When cleaning completed, check if room can be set to AVAILABLE
        if task.room and task.room.status == RoomStatus.CLEANING:
            # Check if open maintenance exists
            maint_res = await db.execute(
                select(MaintenanceRequest).where(
                    MaintenanceRequest.room_id == task.room.id,
                    MaintenanceRequest.status.in_([MaintenanceStatus.PENDING, MaintenanceStatus.IN_PROGRESS])
                )
            )
            if not maint_res.scalars().first():
                task.room.status = RoomStatus.AVAILABLE

    await db.commit()

    res = await db.execute(
        select(HousekeepingTask)
        .where(HousekeepingTask.id == id)
        .options(selectinload(HousekeepingTask.room).selectinload(Room.room_type), selectinload(HousekeepingTask.assigned_staff))
    )
    return res.scalar_one()
