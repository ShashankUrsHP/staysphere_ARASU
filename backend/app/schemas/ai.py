from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ConciergeChatRequest(BaseModel):
    message: str
    room_number: Optional[str] = "304"
    booking_reference: Optional[str] = None

class ConciergeActionTaken(BaseModel):
    action_type: str # e.g. HOUSEKEEPING_REQUEST_CREATED, ROOM_SERVICE_ORDER_PLACED, MAINTENANCE_REQUEST_CREATED, INFORMATION_PROVIDED
    details: Dict[str, Any]
    entity_id: Optional[str] = None

class ConciergeChatResponse(BaseModel):
    reply: str
    intent_detected: str
    confidence: float
    action_taken: Optional[ConciergeActionTaken] = None
    suggested_actions: List[str] = []

class AIInsightResponse(BaseModel):
    id: str
    type: str # FORECAST, DEMAND, PRICING, SERVICE
    title: str
    description: str
    confidence: float
    metric: str
    action_text: str
    category: str
