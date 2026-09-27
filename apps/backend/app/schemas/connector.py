from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any, Literal
from datetime import datetime

class ConnectorBase(BaseModel):
    name: str
    type: Literal['docker', 's3']
    config: Dict[str, Any]
    is_active: bool = True

class ConnectorCreate(ConnectorBase):
    pass

class ConnectorUpdate(BaseModel):
    name: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class ConnectorResponse(ConnectorBase):
    id: int
    app_id: str
    last_sync_at: Optional[datetime] = None
    last_status: Optional[str] = None
    last_error: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class DockerConfig(BaseModel):
    endpoint: str = "unix:///var/run/docker.sock"
    tls_verify: bool = False
    cert_path: Optional[str] = None
    container_labels: Optional[Dict[str, str]] = None
