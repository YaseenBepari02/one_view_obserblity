"""
OneView Monitor — Live Health Service

Collects real host-level metrics and transforms them into the same
response shape that the demo DemoDataService.get_health_metrics() returns,
so the frontend works identically with live data.
"""

import asyncio
import time
from datetime import datetime, timezone
from typing import Any

from app.services.host_metrics import get_all_host_metrics


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class LiveHealthService:
    """Collects real OS-level metrics and returns them in the OneView schema."""

    def __init__(self):
        self._time_series_buffer: dict[str, list[dict]] = {
            "cpu": [],
            "memory": [],
            "disk": [],
        }
        self._max_ts_points = 288  # 24 hours at 5-minute intervals

    async def get_health_metrics(self, app_id: str) -> dict[str, Any]:
        """
        Collect live host metrics for the given application.

        This runs the CPU sampling (which sleeps 0.3s) in a thread pool
        so it doesn't block the async event loop.
        """
        loop = asyncio.get_event_loop()
        metrics = await loop.run_in_executor(
            None, get_all_host_metrics, 0.3
        )

        cpu = metrics["cpu_percent"]
        mem = metrics["memory"]
        disk = metrics["disk"]
        load = metrics["load_average"]
        net = metrics["network"]

        # Compute network totals across all interfaces
        total_recv = sum(iface["recv_bytes"] for iface in net.values())
        total_sent = sum(iface["sent_bytes"] for iface in net.values())

        # Convert bytes to rough Mbps estimate (cumulative, so approximate)
        ingress_mbps = round(total_recv / (1024 * 1024), 2)
        egress_mbps = round(total_sent / (1024 * 1024), 2)

        # Determine health state based on real metrics
        health_score = self._compute_health_score(cpu, mem["used_percent"], disk["used_percent"])
        if health_score >= 85:
            health_state = "healthy"
        elif health_score >= 60:
            health_state = "warning"
        else:
            health_state = "critical"

        # Append to in-memory time series
        now_iso = utcnow().isoformat()
        self._append_ts("cpu", now_iso, cpu)
        self._append_ts("memory", now_iso, mem["used_percent"])
        self._append_ts("disk", now_iso, disk["used_percent"])

        return {
            "_live": True,
            "_demo": False,
            "application": app_id,
            "health_state": health_state,
            "health_score": health_score,
            "uptime_percent": 99.99,  # TODO: compute from actual uptime tracking
            "request_rate": 0,  # requires app-level instrumentation
            "error_rate": 0,
            "error_count": 0,
            "avg_latency_ms": 0,
            "p50_latency_ms": 0,
            "p95_latency_ms": 0,
            "p99_latency_ms": 0,
            "cpu_usage_percent": cpu,
            "memory_usage_percent": mem["used_percent"],
            "memory_total_mb": mem["total_mb"],
            "memory_used_mb": mem["used_mb"],
            "memory_available_mb": mem["available_mb"],
            "disk_usage_percent": disk["used_percent"],
            "disk_total_gb": disk["total_gb"],
            "disk_used_gb": disk["used_gb"],
            "disk_free_gb": disk["free_gb"],
            "disk_path": disk["path"],
            "load_average": load,
            "network_ingress_mb": ingress_mbps,
            "network_egress_mb": egress_mbps,
            "network_interfaces": net,
            "total_containers": 0,
            "running_containers": 0,
            "restart_count": 0,
            "container_failures": 0,
            "active_incidents": 0,
            "time_series": {
                "cpu": self._time_series_buffer["cpu"][-288:],
                "memory": self._time_series_buffer["memory"][-288:],
            },
        }

    def _compute_health_score(self, cpu: float, mem: float, disk: float) -> int:
        """
        Simple health score formula:
        - CPU below 80% = good, 80-95% = degraded, 95%+ = critical
        - Memory below 85% = good, 85-95% = degraded, 95%+ = critical
        - Disk below 80% = good, 80-90% = degraded, 90%+ = critical
        """
        score = 100.0

        # CPU penalty
        if cpu > 95:
            score -= 40
        elif cpu > 80:
            score -= 20
        elif cpu > 60:
            score -= 5

        # Memory penalty
        if mem > 95:
            score -= 35
        elif mem > 85:
            score -= 15
        elif mem > 70:
            score -= 5

        # Disk penalty
        if disk > 90:
            score -= 25
        elif disk > 80:
            score -= 10
        elif disk > 70:
            score -= 3

        return max(0, min(100, int(score)))

    def _append_ts(self, key: str, timestamp: str, value: float):
        """Append a data point to the in-memory time-series buffer."""
        self._time_series_buffer[key].append({
            "timestamp": timestamp,
            "value": round(value, 2),
            "_live": True,
        })
        # Trim to max size
        if len(self._time_series_buffer[key]) > self._max_ts_points:
            self._time_series_buffer[key] = self._time_series_buffer[key][-self._max_ts_points:]


# Singleton instance
_live_health_service = LiveHealthService()


def get_live_health_service() -> LiveHealthService:
    return _live_health_service
