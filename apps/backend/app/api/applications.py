"""
OneView Monitor — Applications API

CRUD endpoints for application registry.
"""

from fastapi import APIRouter, HTTPException, status

from app.core.config import get_settings
from app.schemas.schemas import ApplicationResponse
from app.services.demo import DemoDataService

router = APIRouter()
settings = get_settings()
demo_service = DemoDataService()


@router.get("", response_model=list[dict])
async def list_applications():
    """List all registered applications."""
    if settings.DEMO_MODE:
        return demo_service.get_applications()
    # Production: query database
    return []


@router.get("/{app_id}")
async def get_application(app_id: str):
    """Get a single application by ID."""
    if settings.DEMO_MODE:
        apps = demo_service.get_applications()
        app = next((a for a in apps if a["id"] == app_id), None)
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
        return app
    raise HTTPException(status_code=404, detail="Application not found")


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_application(data: dict):
    """Register a new application."""
    # Phase 5: proper DB creation
    return {"message": "Application created", "data": data}


@router.patch("/{app_id}")
async def update_application(app_id: str, data: dict):
    """Update application configuration."""
    return {"message": f"Application {app_id} updated", "data": data}


@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_application(app_id: str):
    """Remove an application from the registry."""
    return None
