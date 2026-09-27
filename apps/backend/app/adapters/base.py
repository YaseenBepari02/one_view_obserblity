"""
OneView Monitor — Adapter Base Classes

Abstract base classes for all source adapters.
New applications implement these interfaces and register in config.
No core module changes required.
"""

from abc import ABC, abstractmethod
from typing import Any, AsyncGenerator


class ApplicationAdapter(ABC):
    """Base adapter for application-specific data collection."""

    @abstractmethod
    async def get_health_metrics(self) -> dict[str, Any]:
        """Return current health metrics for the application."""
        ...

    @abstractmethod
    async def get_users(self, filters: dict) -> list[dict]:
        """Return user list with optional filtering."""
        ...

    @abstractmethod
    async def get_sessions(self, filters: dict) -> list[dict]:
        """Return session list with optional filtering."""
        ...

    @abstractmethod
    async def get_api_metrics(self, filters: dict) -> dict[str, Any]:
        """Return API usage metrics."""
        ...

    @abstractmethod
    async def get_business_metrics(self) -> dict[str, Any]:
        """Return application-specific business metrics."""
        ...

    @abstractmethod
    async def get_feature_metrics(self) -> dict[str, Any]:
        """Return feature usage metrics."""
        ...


class LogSourceAdapter(ABC):
    """Base adapter for log data sources."""

    @abstractmethod
    async def stream_logs(self, filters: dict) -> AsyncGenerator[dict, None]:
        """Stream log events. Yields normalized log event dicts."""
        ...

    @abstractmethod
    async def query_logs(
        self, query: str, filters: dict, limit: int = 100, offset: int = 0
    ) -> list[dict]:
        """Query historical logs with pagination."""
        ...


class MetricsSourceAdapter(ABC):
    """Base adapter for metrics data sources."""

    @abstractmethod
    async def query_metrics(
        self, metric: str, start: str, end: str, step: str
    ) -> list[dict]:
        """Query time-series metric data."""
        ...

    @abstractmethod
    async def get_current_value(self, metric: str) -> float | None:
        """Get the current value of a metric."""
        ...


class NotificationAdapter(ABC):
    """Base adapter for alert notifications."""

    @abstractmethod
    async def send(self, alert: dict) -> bool:
        """Send alert notification. Returns True on success."""
        ...
