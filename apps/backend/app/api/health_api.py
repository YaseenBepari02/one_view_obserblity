"""
OneView Monitor — Health API

Health monitoring endpoints per application and global summary.
Now supports real live host metrics alongside demo mode.
"""

from fastapi import APIRouter, HTTPException

from app.core.config import get_settings
from app.services.demo import DemoDataService
from app.services.live_health import get_live_health_service

router = APIRouter()
settings = get_settings()
demo_service = DemoDataService()
live_health = get_live_health_service()


@router.get("/applications/{app_id}/health")
async def get_app_health(app_id: str, live: bool = False):
    """Health metrics for a specific application.
    
    Query params:
        live=true  → collect real OS-level metrics from this host
        live=false → use demo synthetic data (default when DEMO_MODE is on)
    """
    if live:
        try:
            return await live_health.get_health_metrics(app_id)
        except Exception as exc:
            # If live collection fails, fall back to demo or error
            if settings.DEMO_MODE:
                data = demo_service.get_health_metrics(app_id)
                data["_live_error"] = str(exc)
                return data
            raise HTTPException(status_code=500, detail=f"Live metrics collection failed: {exc}")

    if settings.DEMO_MODE:
        return demo_service.get_health_metrics(app_id)
    raise HTTPException(status_code=404, detail="No health data available")


@router.get("/applications/{app_id}/health/live")
async def get_live_health(app_id: str):
    """Dedicated endpoint that always returns real live host metrics."""
    try:
        return await live_health.get_health_metrics(app_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Live metrics collection failed: {exc}")


@router.get("/applications/{app_id}/health/signals")
async def get_health_signals(app_id: str):
    """Individual health score signals and their contributions."""
    if settings.DEMO_MODE:
        data = demo_service.get_health_metrics(app_id)
        return {
            "application": app_id,
            "state": data["health_state"],
            "score": data["health_score"],
            "signals": {
                "availability": {"value": data["uptime_percent"], "weight": 0.3, "contribution": round(data["uptime_percent"] * 0.3, 2)},
                "error_rate": {"value": data["error_rate"], "weight": 0.2, "contribution": round((100 - data["error_rate"]) * 0.2, 2)},
                "p95_latency": {"value": data["p95_latency_ms"], "weight": 0.15, "contribution": round(max(0, (1000 - data["p95_latency_ms"]) / 1000) * 15, 2)},
                "cpu_usage": {"value": data["cpu_usage_percent"], "weight": 0.1, "contribution": round((100 - data["cpu_usage_percent"]) * 0.1, 2)},
                "memory_usage": {"value": data["memory_usage_percent"], "weight": 0.1, "contribution": round((100 - data["memory_usage_percent"]) * 0.1, 2)},
            },
            "missing_signals": ["disk_usage", "container_health"],
            "_demo": True,
        }
    return {"signals": {}, "missing_signals": []}


@router.get("/health/summary")
async def get_health_summary():
    """Aggregated health summary across all applications."""
    if settings.DEMO_MODE:
        return {
            "total": 3,
            "healthy": 2,
            "warning": 1,
            "critical": 0,
            "unknown": 0,
            "_demo": True,
        }
    return {"total": 0, "healthy": 0, "warning": 0, "critical": 0, "unknown": 0}


@router.get("/host/metrics")
async def get_raw_host_metrics():
    """Raw host-level metrics (CPU, memory, disk, network, load).
    
    Always returns live data from the current machine,
    regardless of DEMO_MODE setting.
    """
    from app.services.host_metrics import get_all_host_metrics
    import asyncio

    loop = asyncio.get_event_loop()
    metrics = await loop.run_in_executor(None, get_all_host_metrics, 0.3)
    return {
        "status": "ok",
        "source": "host",
        "metrics": metrics,
    }
