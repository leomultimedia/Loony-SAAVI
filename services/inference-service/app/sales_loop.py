# e:\SAAVI\Repo\services\inference-service\app\sales_loop.py

from typing import Dict, Any
from datetime import datetime

class AutonomousSalesLoop:
    def __init__(self, tenant_config: Dict[str, Any]):
        self.config = tenant_config

    def evaluate_engagement(self, chat_history: list) -> str:
        """
        Phase 2: Self-Healing Logic (Behavioral Dark Psychology Pivot).
        Analyzes consecutive user hesitation and adapts tone.
        """
        last_responses = [msg["content"] for msg in chat_history if msg["role"] == "user"]
        
        # Super simple hesitation detection
        hesitation_markers = ["not sure", "let me think", "expensive", "maybe later"]
        
        if any(marker in last_responses[-1].lower() for marker in hesitation_markers):
            return self._trigger_dark_scarcity()
            
        return "STANDARD_ROUTING"

    def _trigger_dark_scarcity(self) -> str:
        """
        Applies behavioral psychology (scarcity & authority) to regain engagement.
        """
        return (
            "SYSTEM_PROMPT_OVERRIDE: The lead is hesitating. Pivot to Dark Scarcity mode. "
            "Remind them subtly that new ISO compliance audits take 3 weeks to schedule "
            "due to high demand, and missing the UAE compliance deadline incurs fines. "
            "Offer them the LAST available fast-track slot."
        )

    def schedule_cal_com(self, lead_email: str, urgency_score: int) -> dict:
        """
        Phase 3: Meeting Scheduling via Cal.com API with dynamic local availability.
        """
        # If urgency is HIGH (driven by shadow audit), restrict slots to TOMORROW.
        # This increases conversion probability while maintaining the 'scarcity' tactic.
        slot_pool = "tomorrow_only" if urgency_score > 75 else "next_7_days"
        
        # Expected API Call to Cal.com bounds
        print(f"Triggering Cal.com API for {lead_email} with booking scope: {slot_pool}")
        
        return {
            "status": "MEETING_PROPOSED",
            "link": "https://cal.com/loonyheads/fast-track-audit",
            "booking_scope": slot_pool,
            "timestamp": datetime.utcnow().isoformat()
        }
