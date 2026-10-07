from fastapi import APIRouter, Query
from app.services.ml_service import RevenueManagementML

router = APIRouter(prefix="/ml", tags=["Machine Learning"])

@router.get("/pricing-recommendation")
async def get_pricing_recommendation(
    base_price: float = Query(12500.0),
    occupancy_rate: float = Query(82.4),
    lead_days: int = Query(5)
):
    return RevenueManagementML.calculate_price_recommendation(
        base_price=base_price,
        current_occupancy=occupancy_rate,
        lead_days=lead_days
    )
