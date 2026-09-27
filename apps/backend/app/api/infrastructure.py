"""
OneView Monitor — Infrastructure API

Container and resource monitoring endpoints.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import get_settings
from app.core.database import get_db
from app.services.demo import DemoDataService
from app.models.models import Connector
from app.adapters.docker import DockerAdapter

router = APIRouter()
settings = get_settings()
demo_service = DemoDataService()


@router.get("/applications/{app_id}/infrastructure")
async def get_infrastructure(app_id: str, db: AsyncSession = Depends(get_db)):
    """Infrastructure overview for an application."""
    # Check for real docker connector
    result = await db.execute(select(Connector).where(Connector.application_id == app_id, Connector.connector_type == "docker"))
    connector = result.scalars().first()
    
    if connector and connector.enabled:
        adapter = DockerAdapter(
            endpoint=connector.config.get("endpoint", "unix:///var/run/docker.sock"),
            tls_verify=connector.config.get("tls_verify", False),
        )
        try:
            summary = await adapter.get_infrastructure_summary(app_id)
            return summary
        except Exception as e:
            # Fallback below on error or return error depending on requirements
            pass
            
    if settings.DEMO_MODE:
        return demo_service.get_infrastructure(app_id)
        
    return {"containers": [], "total_containers": 0}


@router.get("/applications/{app_id}/containers")
async def get_containers(app_id: str, db: AsyncSession = Depends(get_db)):
    """Container list with stats for an application."""
    result = await db.execute(select(Connector).where(Connector.application_id == app_id, Connector.connector_type == "docker"))
    connector = result.scalars().first()
    
    if connector and connector.enabled:
        adapter = DockerAdapter(
            endpoint=connector.config.get("endpoint", "unix:///var/run/docker.sock"),
            tls_verify=connector.config.get("tls_verify", False),
        )
        try:
            containers = await adapter.get_containers(app_id)
            return {"containers": containers, "_demo": False}
        except Exception:
            pass

    if settings.DEMO_MODE:
        infra = demo_service.get_infrastructure(app_id)
        return {"containers": infra["containers"], "_demo": True}
    return {"containers": []}
