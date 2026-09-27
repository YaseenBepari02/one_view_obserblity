"""
OneView Monitor — Logs API

Log query and search endpoints with pagination.
"""

from fastapi import APIRouter, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.core.config import get_settings
from app.core.database import get_db
from app.services.demo import DemoDataService
from app.models.models import Connector
from app.adapters.docker import DockerAdapter

router = APIRouter()
settings = get_settings()
demo_service = DemoDataService()


@router.get("/applications/{app_id}/logs")
async def get_app_logs(
    app_id: str,
    q: str = "",
    level: Optional[str] = Query(None, description="Comma-separated levels: DEBUG,INFO,WARN,ERROR,FATAL"),
    service: Optional[str] = None,
    container: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Query logs for a specific application."""
    # Check for docker connector
    result = await db.execute(select(Connector).where(Connector.application_id == app_id, Connector.connector_type == "docker"))
    connector = result.scalars().first()
    
    if connector and connector.enabled:
        adapter = DockerAdapter(
            endpoint=connector.config.get("endpoint", "unix:///var/run/docker.sock"),
            tls_verify=connector.config.get("tls_verify", False),
        )
        try:
            logs = await adapter.query_logs(app_id=app_id, query=q, limit=limit, offset=offset)
            
            # Apply additional filtering if necessary
            if level:
                allowed = set(level.upper().split(","))
                logs = [l for l in logs if l["level"] in allowed]
            if service:
                logs = [l for l in logs if service.lower() in l["service"].lower()]
            if container:
                logs = [l for l in logs if container.lower() in l["container"].lower()]
                
            return {
                "items": logs,
                "total": len(logs) + offset, # approximation unless we count all
                "limit": limit,
                "offset": offset,
                "_demo": False,
            }
        except Exception:
            pass
            
    if settings.DEMO_MODE:
        logs = demo_service.get_logs(app_id, limit=500)

        # Apply filters
        if q:
            logs = [l for l in logs if q.lower() in l["message"].lower()]
        if level:
            allowed = set(level.upper().split(","))
            logs = [l for l in logs if l["level"] in allowed]
        if service:
            logs = [l for l in logs if service.lower() in l["service"].lower()]
        if container:
            logs = [l for l in logs if container.lower() in l["container"].lower()]

        total = len(logs)
        page = logs[offset:offset + limit]
        return {
            "items": page,
            "total": total,
            "limit": limit,
            "offset": offset,
            "_demo": True,
        }
    return {"items": [], "total": 0, "limit": limit, "offset": offset}


@router.get("/logs/query")
async def query_logs(
    q: str = "",
    level: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
):
    """Global log query across all applications."""
    if settings.DEMO_MODE:
        all_logs = []
        for app_id in ["netra", "kavach", "blackline"]:
            all_logs.extend(demo_service.get_logs(app_id, limit=100))
        all_logs.sort(key=lambda x: x["timestamp"], reverse=True)

        if q:
            all_logs = [l for l in all_logs if q.lower() in l["message"].lower()]
        if level:
            allowed = set(level.upper().split(","))
            all_logs = [l for l in all_logs if l["level"] in allowed]

        total = len(all_logs)
        page = all_logs[offset:offset + limit]
        return {"items": page, "total": total, "limit": limit, "offset": offset, "_demo": True}
    return {"items": [], "total": 0, "limit": limit, "offset": offset}
