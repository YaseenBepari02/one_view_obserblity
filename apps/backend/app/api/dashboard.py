"""
OneView Monitor — Dashboard API

Aggregated dashboard data for the home page.
"""

from fastapi import APIRouter

from app.core.config import get_settings
from app.services.demo import DemoDataService

router = APIRouter()
settings = get_settings()
demo_service = DemoDataService()


@router.get("/summary")
async def get_dashboard_summary():
    """Aggregated KPIs across all applications."""
    if settings.DEMO_MODE:
        return demo_service.get_dashboard_summary()
    return {
        "total_applications": 0,
        "healthy": 0,
        "warning": 0,
        "critical": 0,
        "unknown": 0,
        "total_active_users": 0,
        "active_sessions": 0,
        "total_api_requests": 0,
        "total_errors": 0,
        "estimated_cost": 0.0,
        "total_tokens": 0,
    }
