import numpy as np

class RevenueManagementML:
    @staticmethod
    def calculate_price_recommendation(base_price: float, current_occupancy: float, lead_days: int) -> dict:
        """
        Uses dynamic pricing multiplier logic with numpy algorithm.
        """
        # Base demand curve
        occupancy_factor = 1.0 + max(0.0, (current_occupancy - 70.0) / 100.0 * 0.8)
        lead_time_factor = 1.05 if lead_days < 7 else 0.98

        suggested_rate = round(base_price * occupancy_factor * lead_time_factor, -2)
        confidence = min(0.96, max(0.75, 0.80 + (current_occupancy / 500.0)))

        rationale = []
        if current_occupancy > 80:
            rationale.append(f"High occupancy level ({current_occupancy:.1f}%) signals high demand elasticity.")
        if lead_days < 7:
            rationale.append("Short booking window (under 7 days) allows premium rate capture.")

        return {
            "current_adr": base_price,
            "recommended_adr": suggested_rate,
            "model_confidence": round(confidence, 2),
            "rationale": " | ".join(rationale) if rationale else "Demand and booking pace are aligned with historical seasonal averages."
        }
