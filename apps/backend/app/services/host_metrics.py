"""
host_metrics.py
----------------
Cross-platform host-level health metrics collector.

On Linux: reads directly from /proc and via shutil (zero third-party deps).
On Windows: uses psutil (must be installed: pip install psutil).

Metrics collected (mirrors the Host category in the Observability LLD):
    - CPU %
    - Load Average % (normalized against core count)
    - Disk Usage (used/total)
    - Virtual Memory (used/total)
    - Network Recv / Sent (cumulative bytes since boot, per interface)
"""

import os
import sys
import shutil
import time
import platform

IS_LINUX = platform.system() == "Linux"
IS_WINDOWS = platform.system() == "Windows"

# Try importing psutil for Windows (and as fallback on Linux)
_psutil = None
try:
    import psutil as _psutil
except ImportError:
    pass


# ── Linux: /proc-based implementations ──────────────────────────────────


def _read_proc_stat_cpu_line() -> tuple:
    """Read the aggregate 'cpu' line from /proc/stat."""
    with open("/proc/stat", "r") as f:
        line = f.readline()
    parts = line.split()
    values = [int(x) for x in parts[1:11]]
    while len(values) < 10:
        values.append(0)
    return tuple(values)


def _linux_cpu_percent(sample_interval: float = 0.5) -> float:
    """Compute host CPU utilization % by sampling /proc/stat twice."""
    t1 = _read_proc_stat_cpu_line()
    time.sleep(sample_interval)
    t2 = _read_proc_stat_cpu_line()

    total1 = sum(t1)
    total2 = sum(t2)
    idle1 = t1[3] + t1[4]
    idle2 = t2[3] + t2[4]

    total_delta = total2 - total1
    idle_delta = idle2 - idle1

    if total_delta <= 0:
        return 0.0

    used_delta = total_delta - idle_delta
    return round((used_delta / total_delta) * 100.0, 2)


def _linux_load_average() -> dict:
    """Read /proc/loadavg and normalize against core count."""
    with open("/proc/loadavg", "r") as f:
        parts = f.readline().split()

    load_1, load_5, load_15 = float(parts[0]), float(parts[1]), float(parts[2])
    cores = os.cpu_count() or 1

    return {
        "1min": load_1,
        "5min": load_5,
        "15min": load_15,
        "cores": cores,
        "load_percent_1min": round((load_1 / cores) * 100.0, 2),
        "load_percent_5min": round((load_5 / cores) * 100.0, 2),
        "load_percent_15min": round((load_15 / cores) * 100.0, 2),
    }


def _linux_virtual_memory() -> dict:
    """Parse /proc/meminfo for total/used virtual memory (MB)."""
    meminfo = {}
    with open("/proc/meminfo", "r") as f:
        for line in f:
            key, _, value = line.partition(":")
            value = value.strip().split()[0]
            meminfo[key.strip()] = int(value)

    total_kb = meminfo.get("MemTotal", 0)
    available_kb = meminfo.get("MemAvailable", meminfo.get("MemFree", 0))
    used_kb = max(total_kb - available_kb, 0)
    used_percent = (used_kb / total_kb) * 100.0 if total_kb else 0.0

    return {
        "total_mb": round(total_kb / 1024, 2),
        "used_mb": round(used_kb / 1024, 2),
        "available_mb": round(available_kb / 1024, 2),
        "used_percent": round(used_percent, 2),
    }


def _linux_network_io() -> dict:
    """Cumulative recv/sent bytes per interface from /proc/net/dev."""
    interfaces = {}
    with open("/proc/net/dev", "r") as f:
        lines = f.readlines()[2:]

    for line in lines:
        if ":" not in line:
            continue
        name, data = line.split(":", 1)
        name = name.strip()
        fields = data.split()
        if name == "lo":
            continue
        interfaces[name] = {
            "recv_bytes": int(fields[0]),
            "sent_bytes": int(fields[8]),
        }
    return interfaces


# ── Cross-platform: psutil-based implementations ────────────────────────


def _psutil_cpu_percent(sample_interval: float = 0.5) -> float:
    """CPU percent via psutil (works on Windows/Mac/Linux)."""
    if _psutil is None:
        return 0.0
    return round(_psutil.cpu_percent(interval=sample_interval), 2)


def _psutil_load_average() -> dict:
    """Load average via psutil, or synthetic from CPU usage on Windows."""
    cores = os.cpu_count() or 1
    if _psutil is None:
        return {"1min": 0, "5min": 0, "15min": 0, "cores": cores,
                "load_percent_1min": 0, "load_percent_5min": 0, "load_percent_15min": 0}

    try:
        load_1, load_5, load_15 = _psutil.getloadavg()
    except (AttributeError, OSError):
        # Windows doesn't have getloadavg; synthesize from CPU percent
        cpu = _psutil.cpu_percent(interval=0.1) / 100.0 * cores
        load_1 = load_5 = load_15 = round(cpu, 2)

    return {
        "1min": round(load_1, 2),
        "5min": round(load_5, 2),
        "15min": round(load_15, 2),
        "cores": cores,
        "load_percent_1min": round((load_1 / cores) * 100.0, 2),
        "load_percent_5min": round((load_5 / cores) * 100.0, 2),
        "load_percent_15min": round((load_15 / cores) * 100.0, 2),
    }


def _psutil_virtual_memory() -> dict:
    """Memory stats via psutil."""
    if _psutil is None:
        return {"total_mb": 0, "used_mb": 0, "available_mb": 0, "used_percent": 0}
    mem = _psutil.virtual_memory()
    return {
        "total_mb": round(mem.total / (1024 ** 2), 2),
        "used_mb": round(mem.used / (1024 ** 2), 2),
        "available_mb": round(mem.available / (1024 ** 2), 2),
        "used_percent": round(mem.percent, 2),
    }


def _psutil_network_io() -> dict:
    """Network I/O per interface via psutil."""
    if _psutil is None:
        return {}
    counters = _psutil.net_io_counters(pernic=True)
    interfaces = {}
    for name, stats in counters.items():
        if name.lower() in ("lo", "loopback pseudo-interface 1"):
            continue
        interfaces[name] = {
            "recv_bytes": stats.bytes_recv,
            "sent_bytes": stats.bytes_sent,
        }
    return interfaces


# ── Unified API ──────────────────────────────────────────────────────────


def get_cpu_percent(sample_interval: float = 0.5) -> float:
    """Get CPU utilization %."""
    if IS_LINUX and os.path.exists("/proc/stat"):
        return _linux_cpu_percent(sample_interval)
    return _psutil_cpu_percent(sample_interval)


def get_load_average() -> dict:
    """Get load average (normalized against core count)."""
    if IS_LINUX and os.path.exists("/proc/loadavg"):
        return _linux_load_average()
    return _psutil_load_average()


def get_disk_usage(path: str = "/") -> dict:
    """Disk used/total for the given mount path."""
    if IS_WINDOWS:
        path = "C:\\"
    total, used, free = shutil.disk_usage(path)
    total_gb = total / (1024 ** 3)
    used_gb = used / (1024 ** 3)
    free_gb = free / (1024 ** 3)
    used_percent = (used / total) * 100.0 if total else 0.0

    return {
        "path": path,
        "total_gb": round(total_gb, 2),
        "used_gb": round(used_gb, 2),
        "free_gb": round(free_gb, 2),
        "used_percent": round(used_percent, 2),
    }


def get_virtual_memory() -> dict:
    """Get virtual memory stats."""
    if IS_LINUX and os.path.exists("/proc/meminfo"):
        return _linux_virtual_memory()
    return _psutil_virtual_memory()


def get_network_io() -> dict:
    """Get network I/O stats per interface."""
    if IS_LINUX and os.path.exists("/proc/net/dev"):
        return _linux_network_io()
    return _psutil_network_io()


def get_all_host_metrics(cpu_sample_interval: float = 0.5) -> dict:
    """Collect the full Host metric set in one call."""
    return {
        "cpu_percent": get_cpu_percent(sample_interval=cpu_sample_interval),
        "load_average": get_load_average(),
        "disk": get_disk_usage(),
        "memory": get_virtual_memory(),
        "network": get_network_io(),
    }
