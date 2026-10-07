import re
from typing import Dict, Any, Tuple, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.guest_request import GuestRequest, GuestRequestType, GuestRequestStatus
from app.models.housekeeping import TaskPriority
from app.models.notification import Notification
from app.models.room import Room
from app.models.user import User
from app.schemas.ai import ConciergeChatResponse, ConciergeActionTaken

class AIConciergeEngine:
    @staticmethod
    async def process_message(
        message: str,
        room_number: Optional[str],
        user: Optional[User],
        db: AsyncSession
    ) -> ConciergeChatResponse:
        msg_lower = message.lower()
        room_no = room_number or "304"
        guest_id = user.id if user else "guest-anonymous"

        # Find room ID
        room_res = await db.execute(select(Room).where(Room.room_number == room_no))
        room = room_res.scalar_one_or_none()
        room_id = room.id if room else None

        # 1. Housekeeping Intent
        if any(w in msg_lower for w in ["housekeeping", "clean", "towel", "linen", "cleaning", "pillow", "bedsheet"]):
            # Create actual database request
            req = GuestRequest(
                guest_id=guest_id,
                room_id=room_id,
                request_type=GuestRequestType.HOUSEKEEPING if "housekeeping" in msg_lower or "clean" in msg_lower else GuestRequestType.EXTRA_TOWELS,
                description=f"Guest request via AI Concierge: '{message}' for Room {room_no}",
                priority=TaskPriority.MEDIUM,
                status=GuestRequestStatus.REQUESTED
            )
            db.add(req)

            notif = Notification(
                user_id=guest_id,
                title="Housekeeping Dispatched",
                message=f"Housekeeping request created for Room {room_no}. Our team has been notified.",
                type="INFO"
            )
            db.add(notif)
            await db.commit()

            return ConciergeChatResponse(
                reply=f"I have dispatched housekeeping to Room {room_no} for you. A staff member will arrive shortly.",
                intent_detected="HOUSEKEEPING_REQUEST",
                confidence=0.96,
                action_taken=ConciergeActionTaken(
                    action_type="GUEST_REQUEST_CREATED",
                    details={"room_number": room_no, "type": "HOUSEKEEPING", "description": message},
                    entity_id=req.id
                ),
                suggested_actions=["Track Request", "Order Refreshments", "Explore Spa"]
            )

        # 2. Maintenance Intent
        if any(w in msg_lower for w in ["ac", "aircon", "air conditioning", "cooling", "tv", "plumbing", "water", "drain", "maintenance", "fix", "leak"]):
            req = GuestRequest(
                guest_id=guest_id,
                room_id=room_id,
                request_type=GuestRequestType.MAINTENANCE,
                description=f"Maintenance issue reported via AI: '{message}' in Room {room_no}",
                priority=TaskPriority.HIGH,
                status=GuestRequestStatus.REQUESTED
            )
            db.add(req)

            notif = Notification(
                user_id=guest_id,
                title="Maintenance Request Dispatched",
                message=f"Maintenance team notified for Room {room_no} regarding '{message}'.",
                type="WARNING"
            )
            db.add(notif)
            await db.commit()

            return ConciergeChatResponse(
                reply=f"I'm sorry to hear that. I've logged a high-priority maintenance ticket for Room {room_no}. Our engineering team is on its way.",
                intent_detected="MAINTENANCE_REQUEST",
                confidence=0.94,
                action_taken=ConciergeActionTaken(
                    action_type="MAINTENANCE_REQUEST_CREATED",
                    details={"room_number": room_no, "issue": message},
                    entity_id=req.id
                ),
                suggested_actions=["Track Maintenance Ticket", "Contact Front Desk"]
            )

        # 3. Room Service / Restaurant Intent
        if any(w in msg_lower for w in ["water", "food", "dinner", "breakfast", "menu", "coffee", "tea", "snack", "room service", "drink"]):
            return ConciergeChatResponse(
                reply=f"Our 24/7 in-room dining menu features gourmet options including authentic South Indian delicacies and Western classics. You can browse our full digital menu and order directly from the Dining tab!",
                intent_detected="ROOM_SERVICE_INQUIRY",
                confidence=0.91,
                action_taken=ConciergeActionTaken(
                    action_type="INFORMATION_PROVIDED",
                    details={"category": "DINING", "room_number": room_no}
                ),
                suggested_actions=["Browse Restaurant Menu", "Order Bottled Water", "View Breakfast Options"]
            )

        # 4. Checkout Time & Late Checkout Intent
        if any(w in msg_lower for w in ["checkout", "check out", "check-out", "leave"]):
            if "late" in msg_lower:
                req = GuestRequest(
                    guest_id=guest_id,
                    room_id=room_id,
                    request_type=GuestRequestType.LATE_CHECKOUT,
                    description=f"Late checkout inquiry via AI Concierge for Room {room_no}",
                    priority=TaskPriority.MEDIUM,
                    status=GuestRequestStatus.REQUESTED
                )
                db.add(req)
                await db.commit()

                return ConciergeChatResponse(
                    reply=f"Standard check-out time is 11:00 AM. I have submitted your request for late check-out (up to 2:00 PM) for Room {room_no}. The front desk will confirm availability shortly!",
                    intent_detected="LATE_CHECKOUT_REQUEST",
                    confidence=0.95,
                    action_taken=ConciergeActionTaken(
                        action_type="GUEST_REQUEST_CREATED",
                        details={"request_type": "LATE_CHECKOUT", "room_number": room_no},
                        entity_id=req.id
                    ),
                    suggested_actions=["View Invoices", "Book Airport Transfer"]
                )
            else:
                return ConciergeChatResponse(
                    reply="Standard check-out time at StaySphere Grand Bengaluru is 11:00 AM. Express checkout is available directly from your StaySphere guest portal!",
                    intent_detected="CHECKOUT_POLICY_INQUIRY",
                    confidence=0.98,
                    action_taken=None,
                    suggested_actions=["Request Late Checkout", "Express Checkout", "Download Invoice"]
                )

        # 5. Fallback Default Concierge Intent
        return ConciergeChatResponse(
            reply=f"Welcome to StaySphere Concierge! I'm here to assist you with housekeeping, room service, maintenance, or local recommendations in Bengaluru. How may I elevate your stay today?",
            intent_detected="GENERAL_CONCIERGE_HELP",
            confidence=0.88,
            action_taken=None,
            suggested_actions=["Request Housekeeping", "Order In-Room Dining", "Explore Bengaluru Attractions"]
        )
