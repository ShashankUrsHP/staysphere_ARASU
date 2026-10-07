from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.hotels import router as hotels_router
from app.api.v1.rooms import router as rooms_router
from app.api.v1.bookings import router as bookings_router
from app.api.v1.payments import router as payments_router
from app.api.v1.housekeeping import router as housekeeping_router
from app.api.v1.maintenance import router as maintenance_router
from app.api.v1.guest_requests import router as guest_requests_router
from app.api.v1.restaurant import router as restaurant_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.ai import router as ai_router
from app.api.v1.ml import router as ml_router
from app.api.v1.websocket import router as ws_router

api_v1_router = APIRouter()

api_v1_router.include_router(auth_router)
api_v1_router.include_router(hotels_router)
api_v1_router.include_router(rooms_router)
api_v1_router.include_router(bookings_router)
api_v1_router.include_router(payments_router)
api_v1_router.include_router(housekeeping_router)
api_v1_router.include_router(maintenance_router)
api_v1_router.include_router(guest_requests_router)
api_v1_router.include_router(restaurant_router)
api_v1_router.include_router(notifications_router)
api_v1_router.include_router(analytics_router)
api_v1_router.include_router(ai_router)
api_v1_router.include_router(ml_router)
api_v1_router.include_router(ws_router)
