from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.ai import ConciergeChatRequest, ConciergeChatResponse, AIInsightResponse
from app.services.ai_service import AIConciergeEngine
from app.models.user import User
from app.api.deps import get_current_user_optional

router = APIRouter(prefix="/ai", tags=["AI Services"])

@router.post("/concierge", response_model=ConciergeChatResponse)
async def chat_concierge(
    req: ConciergeChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    return await AIConciergeEngine.process_message(
        message=req.message,
        room_number=req.room_number,
        user=current_user,
        db=db
    )

@router.get("/insights", response_model=List[AIInsightResponse])
async def get_ai_insights(db: AsyncSession = Depends(get_db)):
    return [
        AIInsightResponse(
            id="insight-1",
            type="FORECAST",
            title="Weekend Demand Surge Expected",
            description="Predictive model projects 94% occupancy for the upcoming weekend driven by tech conference demand in Bengaluru.",
            confidence=0.92,
            metric="+22% vs last weekend",
            action_text="Optimize Room Allocation",
            category="Revenue Management"
        ),
        AIInsightResponse(
            id="insight-2",
            type="PRICING",
            title="Executive Suite Rate Optimization",
            description="Current booking pace suggests Executive King rates can be increased by 12% without sacrificing conversion rate.",
            confidence=0.88,
            metric="₹14,000 → ₹15,600",
            action_text="Apply Dynamic Price",
            category="Dynamic Pricing"
        ),
        AIInsightResponse(
            id="insight-3",
            type="SERVICE",
            title="Peak Breakfast Service Bottleneck",
            description="Historical staff task logs show 8:30 AM - 9:30 AM peak room service orders. Pre-assigning 2 additional staff recommended.",
            confidence=0.95,
            metric="Avg wait time: 14 mins",
            action_text="Adjust Staff Shift",
            category="Operations"
        )
    ]
