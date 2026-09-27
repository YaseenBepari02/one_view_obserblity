"""
OneView Monitor — Connectors API

CRUD and status endpoints for Docker and S3 connectors.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.config import get_settings
from app.core.database import get_db
from app.core.security import get_current_user, get_admin_user
from app.models.models import User, Connector
from app.schemas.schemas import ConnectorCreate, ConnectorResponse

router = APIRouter()
settings = get_settings()

@router.get("", response_model=List[ConnectorResponse])
async def list_connectors(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all configured connectors."""
    result = await db.execute(select(Connector))
    return result.scalars().all()

@router.post("/docker", status_code=status.HTTP_201_CREATED, response_model=ConnectorResponse)
async def create_docker_connector(
    data: ConnectorCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Configure a Docker connector."""
    if data.connector_type != "docker":
        raise HTTPException(status_code=400, detail="Invalid connector_type for this endpoint")
        
    connector = Connector(
        name=data.name,
        connector_type="docker",
        application_id=data.application_id,
        config=data.config,
        enabled=data.enabled,
        state="connecting"
    )
    db.add(connector)
    await db.commit()
    await db.refresh(connector)
    return connector

@router.post("/s3", status_code=status.HTTP_201_CREATED, response_model=ConnectorResponse)
async def create_s3_connector(
    data: ConnectorCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Configure an S3 connector."""
    if data.connector_type != "s3":
        raise HTTPException(status_code=400, detail="Invalid connector_type for this endpoint")

    connector = Connector(
        name=data.name,
        connector_type="s3",
        application_id=data.application_id,
        config=data.config,
        enabled=data.enabled,
        state="connecting"
    )
    db.add(connector)
    await db.commit()
    await db.refresh(connector)
    return connector

@router.get("/{connector_id}", response_model=ConnectorResponse)
async def get_connector(
    connector_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get connector details."""
    result = await db.execute(select(Connector).where(Connector.id == connector_id))
    connector = result.scalars().first()
    if not connector:
        raise HTTPException(status_code=404, detail="Connector not found")
    return connector

@router.patch("/{connector_id}", response_model=ConnectorResponse)
async def update_connector(
    connector_id: str, 
    data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Update connector configuration."""
    result = await db.execute(select(Connector).where(Connector.id == connector_id))
    connector = result.scalars().first()
    if not connector:
        raise HTTPException(status_code=404, detail="Connector not found")
        
    for key, value in data.items():
        if hasattr(connector, key):
            setattr(connector, key, value)
            
    await db.commit()
    await db.refresh(connector)
    return connector

@router.delete("/{connector_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_connector(
    connector_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Remove a connector."""
    result = await db.execute(select(Connector).where(Connector.id == connector_id))
    connector = result.scalars().first()
    if not connector:
        raise HTTPException(status_code=404, detail="Connector not found")
        
    await db.delete(connector)
    await db.commit()
    return None

@router.get("/{connector_id}/status")
async def get_connector_status(
    connector_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current connector state."""
    result = await db.execute(select(Connector).where(Connector.id == connector_id))
    connector = result.scalars().first()
    if not connector:
        raise HTTPException(status_code=404, detail="Connector not found")
        
    return {
        "id": connector.id,
        "state": connector.state,
        "last_connected_at": connector.last_connected_at,
        "last_error": connector.last_error,
    }
