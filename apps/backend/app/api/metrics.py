"""
OneView Monitor — Metrics API

Time-series metric query endpoints.
"""

from typing import Optional

from fastapi import APIRouter, Query

from app.core.config import get_settings
from app.services.demo import DemoDataService

router = APIRouter()
settings = get_settings()
demo_service = DemoDataService()


@router.get("/applications/{app_id}/metrics")
async def get_app_metrics(app_id: str):
    """All available metrics for an application."""
    if settings.DEMO_MODE:
        health = demo_service.get_health_metrics(app_id)
        return {
            "application": app_id,
            "metrics": {
                "cpu_usage_percent": health["cpu_usage_percent"],
                "memory_usage_percent": health["memory_usage_percent"],
                "request_rate": health["request_rate"],
                "error_rate": health["error_rate"],
                "avg_latency_ms": health["avg_latency_ms"],
                "p95_latency_ms": health["p95_latency_ms"],
                "p99_latency_ms": health["p99_latency_ms"],
            },
            "time_series": health["time_series"],
            "_demo": True,
        }
    return {"application": app_id, "metrics": {}, "time_series": {}}


@router.get("/metrics/query")
async def query_metrics(
    metric: str = Query(..., description="Metric name"),
    app_id: Optional[str] = Query(None, alias="application"),
    start: Optional[str] = None,
    end: Optional[str] = None,
    step: str = "5m",
):
    """Query specific metric time-series data."""
    if settings.DEMO_MODE:
        health = demo_service.get_health_metrics(app_id or "netra")
        ts = health.get("time_series", {}).get(metric, [])
        return {
            "metric": metric,
            "application": app_id,
            "data": ts,
            "_demo": True,
        }
    return {"metric": metric, "application": app_id, "data": []}


@router.get("/applications/{app_id}/api-usage")
async def get_api_usage(app_id: str):
    """API usage metrics for an application (Netra-specific in Phase 3)."""
    if settings.DEMO_MODE and app_id == "netra":
        return demo_service.get_netra_api_usage()
    return {"message": "Not configured", "application_metrics": False}


@router.get("/applications/{app_id}/cost")
async def get_cost(app_id: str):
    """Cost and token usage for an application."""
    if settings.DEMO_MODE and app_id == "netra":
        return demo_service.get_netra_cost()
    return {"message": "Not configured", "application_metrics": False}


@router.get("/applications/{app_id}/cost/breakdown")
async def get_cost_breakdown(app_id: str):
    """Detailed cost breakdown by model, user, endpoint."""
    if settings.DEMO_MODE and app_id == "netra":
        tokens = demo_service.get_netra_tokens()
        return {
            "per_model": tokens["per_model"],
            "_demo": True,
        }
    return {"message": "Not configured"}


@router.get("/applications/{app_id}/users")
async def get_users(app_id: str):
    """User metrics for an application."""
    if settings.DEMO_MODE and app_id == "netra":
        return demo_service.get_netra_users()
    return {"message": "Not configured", "application_metrics": False}


@router.get("/applications/{app_id}/sessions")
async def get_sessions(app_id: str):
    """Session metrics for an application."""
    if settings.DEMO_MODE and app_id == "netra":
        return demo_service.get_netra_sessions()
    return {"message": "Not configured", "application_metrics": False}
