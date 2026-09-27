"""
Docker adapter for fetching container statistics and logs.
"""
import docker
from typing import List, Dict, Any, AsyncGenerator, Optional
import asyncio
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

class DockerAdapter:
    def __init__(self, endpoint: str = "unix:///var/run/docker.sock", tls_verify: bool = False, cert_path: Optional[str] = None):
        self.endpoint = endpoint
        self.tls_verify = tls_verify
        
        # Initialize docker client
        # For phase 1/2 we mainly support local unix socket or tcp without complex TLS
        if endpoint.startswith("unix://"):
            self.client = docker.DockerClient(base_url=endpoint)
        else:
            self.client = docker.DockerClient(base_url=endpoint)
            
        self._executor = ThreadPoolExecutor(max_workers=4)

    async def _run_in_thread(self, func, *args, **kwargs):
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(self._executor, lambda: func(*args, **kwargs))

    async def get_containers(self, app_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """List containers, optionally filtered by application."""
        filters = {}
        if app_id:
            # We assume containers might be labeled with the app_id
            filters["label"] = f"oneview.app={app_id}"
            
        containers = await self._run_in_thread(self.client.containers.list, all=True, filters=filters)
        
        result = []
        for c in containers:
            result.append({
                "container_id": c.short_id,
                "name": c.name,
                "image": c.image.tags[0] if c.image.tags else c.image.id,
                "status": c.status,
                "state": "healthy" if c.status == "running" else "critical" if c.status in ("exited", "dead") else "unknown",
                "created_at": c.attrs.get("Created", ""),
                "labels": c.labels,
                "restart_count": c.attrs.get("RestartCount", 0),
            })
        return result

    async def get_container_stats(self, container_id: str) -> Dict[str, Any]:
        """Get CPU/Memory/Network stats for a single container."""
        def fetch_stats():
            container = self.client.containers.get(container_id)
            stats = container.stats(stream=False)
            return stats
            
        stats = await self._run_in_thread(fetch_stats)
        
        # Calculate CPU percent
        cpu_delta = stats["cpu_stats"]["cpu_usage"]["total_usage"] - stats["precpu_stats"]["cpu_usage"]["total_usage"]
        system_cpu_delta = stats["cpu_stats"]["system_cpu_usage"] - stats["precpu_stats"]["system_cpu_usage"]
        online_cpus = stats["cpu_stats"].get("online_cpus", len(stats["cpu_stats"]["cpu_usage"].get("percpu_usage", [1])))
        
        cpu_percent = 0.0
        if system_cpu_delta > 0.0 and cpu_delta > 0.0:
            cpu_percent = (cpu_delta / system_cpu_delta) * online_cpus * 100.0
            
        # Calculate Memory
        mem_usage = stats["memory_stats"].get("usage", 0)
        mem_limit = stats["memory_stats"].get("limit", 0)
        
        # Network
        networks = stats.get("networks", {})
        rx_bytes = sum(net["rx_bytes"] for net in networks.values())
        tx_bytes = sum(net["tx_bytes"] for net in networks.values())
        
        return {
            "container_id": container_id,
            "cpu_percent": cpu_percent,
            "memory_usage_mb": mem_usage / (1024 * 1024),
            "memory_limit_mb": mem_limit / (1024 * 1024) if mem_limit else 0,
            "memory_percent": (mem_usage / mem_limit * 100) if mem_limit else 0,
            "network_rx_mb": rx_bytes / (1024 * 1024),
            "network_tx_mb": tx_bytes / (1024 * 1024),
        }

    async def get_infrastructure_summary(self, app_id: Optional[str] = None) -> Dict[str, Any]:
        """Aggregate stats across all containers for an app."""
        containers = await self.get_containers(app_id)
        
        running = [c for c in containers if c["status"] == "running"]
        
        total_cpu = 0.0
        total_mem = 0.0
        total_rx = 0.0
        total_tx = 0.0
        
        container_stats = []
        for c in containers:
            if c["status"] == "running":
                try:
                    stats = await self.get_container_stats(c["container_id"])
                    c.update(stats)
                    total_cpu += stats["cpu_percent"]
                    total_mem += stats["memory_usage_mb"]
                    total_rx += stats["network_rx_mb"]
                    total_tx += stats["network_tx_mb"]
                except Exception:
                    pass
            container_stats.append(c)
            
        # Note: total_cpu is sum of per-container percentages, could be > 100%
        # Memory is returned in MB, so we might need a rough estimate of total system memory for percentage,
        # or we just return the raw usage.
        
        return {
            "cpu_usage_percent": total_cpu,
            "memory_usage_mb": total_mem,
            "network_rx_mbps": total_rx, # Rough conversion if polled regularly
            "network_tx_mbps": total_tx,
            "total_containers": len(containers),
            "running_containers": len(running),
            "error_count": sum(1 for c in containers if c["restart_count"] > 0),
            "containers": container_stats
        }

    async def query_logs(self, app_id: str, query: str = "", limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """Fetch historical logs from containers belonging to this app."""
        containers = await self.get_containers(app_id)
        if not containers:
            return []
            
        logs_result = []
        # In a real system, querying logs across multiple containers needs multiplexing/sorting.
        # Here we just fetch tail logs from all, combine and sort.
        # This is a naive implementation suitable for phase 2 initial integration.
        for c_info in containers:
            try:
                def get_container_logs():
                    container = self.client.containers.get(c_info["container_id"])
                    # Get recent logs
                    return container.logs(tail=limit + offset, timestamps=True, stdout=True, stderr=True)
                
                raw_logs = await self._run_in_thread(get_container_logs)
                if not raw_logs:
                    continue
                    
                lines = raw_logs.decode('utf-8', errors='replace').splitlines()
                
                for line in lines:
                    if not line.strip():
                        continue
                    
                    # docker-py with timestamps=True format: "2024-02-14T10:10:10.123456789Z log message"
                    parts = line.split(" ", 1)
                    if len(parts) == 2:
                        ts_str, msg = parts
                        # A simple severity heuristic for phase 2
                        level = "INFO"
                        msg_upper = msg.upper()
                        if "ERROR" in msg_upper or "EXCEPTION" in msg_upper or "FATAL" in msg_upper:
                            level = "ERROR"
                        elif "WARN" in msg_upper:
                            level = "WARN"
                        elif "DEBUG" in msg_upper:
                            level = "DEBUG"

                        if query and query.lower() not in msg.lower():
                            continue
                            
                        logs_result.append({
                            "timestamp": ts_str,
                            "level": level,
                            "message": msg.strip(),
                            "service": app_id,
                            "container": c_info["name"],
                            "application_id": app_id,
                            "environment": "prod",
                            "host": "docker-host"
                        })
            except Exception:
                pass
                
        # Sort combined logs by timestamp desc
        logs_result.sort(key=lambda x: x["timestamp"], reverse=True)
        
        # Apply offset and limit
        return logs_result[offset : offset + limit]

    async def ping(self) -> bool:
        """Check connection to docker daemon."""
        try:
            await self._run_in_thread(self.client.ping)
            return True
        except Exception:
            return False
