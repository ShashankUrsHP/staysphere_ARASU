from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.hotel import Hotel
from app.models.room import RoomType
from app.schemas.hotel import HotelResponse, HotelCreate
from app.schemas.room import RoomTypeResponse
from app.models.user import UserRole
from app.api.deps import require_role

router = APIRouter(prefix="/hotels", tags=["Hotels"])

@router.get("", response_model=List[HotelResponse])
async def list_hotels(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Hotel))
    return result.scalars().all()

@router.get("/{id}", response_model=HotelResponse)
async def get_hotel(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Hotel).where(Hotel.id == id))
    hotel = result.scalar_one_or_none()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return hotel

@router.get("/{id}/room-types", response_model=List[RoomTypeResponse])
async def get_hotel_room_types(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RoomType).where(RoomType.hotel_id == id))
    return result.scalars().all()
