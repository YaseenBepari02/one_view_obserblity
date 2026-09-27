"""
OneView Monitor — Pydantic Schemas

Request/response models for all API endpoints.
Pydantic v2 with strict validation.
"""

from datetime import datetime
from typing import Optional, Any, Literal
from pydantic import BaseModel, Field


# ── Application ──────────────────────────────────────────────────────────────

class ApplicationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=128)
    description: str = ""
    enabled: bool = True
    health_monitoring: bool = True
    logs: bool = True
    application_metrics: bool = False
    custom_adapter: str = ""
    custom_metrics: list[dict] = Field(default_factory=list)
    environment: str = "prod"
    version: str = ""
    owner: str = ""


class ApplicationCreate(ApplicationBase):
    id: str = Field(..., min_length=1, max_length=64, pattern=r"^[a-z0-9_-]+$")


class ApplicationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    enabled: Optional[bool] = None
    health_monitoring: Optional[bool] = None
    logs: Optional[bool] = None
    application_metrics: Optional[bool] = None
    environment: Optional[str] = None
    version: Optional[str] = None
    owner: Optional[str] = None


class ApplicationResponse(ApplicationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── Health ───────────────────────────────────────────────────────────────────

class HealthSignal(BaseModel):
    value: float
    weight: float
    contribution: float


class HealthResponse(BaseModel):
    application: str
    state: Literal["healthy", "warning", "critical", "unknown", "no_data"]
    score: Optional[float] = None
    computed_at: datetime
    signals: dict[str, HealthSignal] = Field(default_factory=dict)
    missing_signals: list[str] = Field(default_factory=list)


class HealthSummaryResponse(BaseModel):
    total: int
    healthy: int
    warning: int
    critical: int
    unknown: int


# ── Metrics ──────────────────────────────────────────────────────────────────

class MetricDataPoint(BaseModel):
    timestamp: datetime
    value: float


class MetricSeries(BaseModel):
    metric: str
    unit: str = ""
    data: list[MetricDataPoint]
    dimensions: dict[str, str] = Field(default_factory=dict)


class MetricResponse(BaseModel):
    application: str
    environment: str
    series: list[MetricSeries]
    time_range: dict[str, str]


# ── Logs ─────────────────────────────────────────────────────────────────────

class LogEventResponse(BaseModel):
    id: int
    timestamp: datetime
    application_id: str
    environment: str
    level: str
    message: str
    service: str = ""
    container: str = ""
    host: str = ""
    request_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    event_metadata: dict = Field(default_factory=dict, validation_alias="event_metadata", serialization_alias="metadata")

    model_config = {"from_attributes": True}


class LogQueryParams(BaseModel):
    q: str = ""
    level: Optional[str] = None
    service: Optional[str] = None
    container: Optional[str] = None
    from_ts: Optional[datetime] = None
    to_ts: Optional[datetime] = None
    limit: int = Field(default=100, ge=1, le=1000)
    offset: int = Field(default=0, ge=0)


class LogQueryResponse(BaseModel):
    items: list[LogEventResponse]
    total: int
    limit: int
    offset: int


# ── Alerts ───────────────────────────────────────────────────────────────────

class AlertRuleCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=128)
    application_id: str
    metric: str
    condition: Literal["greater_than", "less_than", "equals"]
    threshold: float
    severity: Literal["info", "warning", "critical"] = "warning"
    enabled: bool = True
    evaluation_interval_seconds: int = Field(default=60, ge=10)


class AlertRuleResponse(BaseModel):
    id: str
    name: str
    application_id: str
    metric: str
    condition: str
    threshold: float
    severity: str
    enabled: bool
    evaluation_interval_seconds: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AlertEventResponse(BaseModel):
    id: str
    alert_rule_id: str
    application_id: str
    metric: str
    condition: str
    threshold: float
    current_value: float
    severity: str
    state: str
    started_at: datetime
    resolved_at: Optional[datetime] = None
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[datetime] = None
    notification_sent: bool = False

    model_config = {"from_attributes": True}


# ── Connectors ───────────────────────────────────────────────────────────────

class ConnectorCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=128)
    connector_type: Literal["docker", "s3"]
    application_id: str
    config: dict = Field(default_factory=dict)
    enabled: bool = True


class ConnectorResponse(BaseModel):
    id: str
    name: str
    connector_type: str
    application_id: str
    config: dict
    enabled: bool
    state: str
    last_connected_at: Optional[datetime] = None
    last_error: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── Auth ─────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    is_active: bool
    last_login: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# ── KPI / Dashboard ─────────────────────────────────────────────────────────

class KPIValue(BaseModel):
    label: str
    value: float | int | str
    trend: Literal["up", "down", "flat"] = "flat"
    trend_value: Optional[float] = None
    unit: str = ""
    time_window: str = ""


class DashboardSummary(BaseModel):
    total_applications: int
    healthy: int
    warning: int
    critical: int
    unknown: int
    total_active_users: int
    active_sessions: int
    total_api_requests: int
    total_errors: int
    estimated_cost: float
    total_tokens: int
    kpis: list[KPIValue] = Field(default_factory=list)


# ── Infrastructure ───────────────────────────────────────────────────────────

class ContainerInfo(BaseModel):
    container_id: str
    name: str
    image: str
    status: str
    state: str
    cpu_percent: float = 0.0
    memory_usage_mb: float = 0.0
    memory_limit_mb: float = 0.0
    memory_percent: float = 0.0
    network_rx_mb: float = 0.0
    network_tx_mb: float = 0.0
    block_read_mb: float = 0.0
    block_write_mb: float = 0.0
    pid_count: int = 0
    restart_count: int = 0
    created_at: str = ""
    ports: list[dict] = Field(default_factory=list)
    labels: dict[str, str] = Field(default_factory=dict)


class InfrastructureSummary(BaseModel):
    cpu_usage_percent: float = 0.0
    memory_usage_percent: float = 0.0
    network_rx_mbps: float = 0.0
    network_tx_mbps: float = 0.0
    total_containers: int = 0
    running_containers: int = 0
    error_count: int = 0
    containers: list[ContainerInfo] = Field(default_factory=list)


# ── Data Freshness ───────────────────────────────────────────────────────────

class DataFreshnessResponse(BaseModel):
    source: str
    status: Literal["live", "recent", "stale", "no_data", "error"]
    last_updated: Optional[datetime] = None
    seconds_ago: Optional[int] = None
    error_message: Optional[str] = None
