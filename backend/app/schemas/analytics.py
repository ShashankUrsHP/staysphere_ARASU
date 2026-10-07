from pydantic import BaseModel
from typing import List, Dict, Any

class AnalyticsSummary(BaseModel):
    occupancy_rate: float
    today_revenue: float
    active_bookings: int
    available_rooms: int
    occupied_rooms: int
    cleaning_rooms: int
    maintenance_rooms: int
    check_ins_today: int
    check_outs_today: int
    adr: float
    revpar: float

class MonthlyTrendPoint(BaseModel):
    month: str
    revenue: float
    occupancy: float
    bookings: int

class BookingSourceDistribution(BaseModel):
    source: str
    count: int
    percentage: float

class RoomPerformancePoint(BaseModel):
    room_type: str
    occupancy: float
    revenue: float
    adr: float

class AnalyticsDashboardResponse(BaseModel):
    summary: AnalyticsSummary
    monthly_trends: List[MonthlyTrendPoint]
    booking_sources: List[BookingSourceDistribution]
    room_performance: List[RoomPerformancePoint]
