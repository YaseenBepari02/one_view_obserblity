"""
OneView Monitor — Alerts API

Alert rules, events, lifecycle management.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Query

from app.core.config import get_settings
from app.services.demo import DemoDataService

router = APIRouter()
settings = get_settings()
demo_service = DemoDataService()

# In-memory alert rules for Phase 1
_alert_rules: dict[str, dict] = {}


@router.get("")
async def list_alerts(
    app_id: Optional[str] = Query(None, alias="application_id"),
    state: Optional[str] = None,
):
    """List all alert events."""
    if settings.DEMO_MODE:
        alerts = demo_service.get_alerts(app_id)
        if state:
            alerts = [a for a in alerts if a["state"] == state]
        return {"items": alerts, "total": len(alerts), "_demo": True}
    return {"items": [], "total": 0}


@router.get("/rules")
async def list_alert_rules():
    """List all configured alert rules."""
    return list(_alert_rules.values())


@router.post("/rules", status_code=201)
async def create_alert_rule(data: dict):
    """Create a new alert rule."""
    import uuid
    rule_id = str(uuid.uuid4())[:8]
    rule = {"id": f"rule_{rule_id}", **data}
    _alert_rules[rule["id"]] = rule
    return rule


@router.get("/rules/{rule_id}")
async def get_alert_rule(rule_id: str):
    """Get alert rule details."""
    if rule_id not in _alert_rules:
        raise HTTPException(status_code=404, detail="Alert rule not found")
    return _alert_rules[rule_id]


@router.patch("/rules/{rule_id}")
async def update_alert_rule(rule_id: str, data: dict):
    """Update an alert rule."""
    if rule_id not in _alert_rules:
        raise HTTPException(status_code=404, detail="Alert rule not found")
    _alert_rules[rule_id].update(data)
    return _alert_rules[rule_id]


@router.post("/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    """Acknowledge a triggered alert."""
    return {"alert_id": alert_id, "state": "acknowledged", "message": "Alert acknowledged"}


@router.post("/{alert_id}/resolve")
async def resolve_alert(alert_id: str):
    """Resolve an alert."""
    return {"alert_id": alert_id, "state": "resolved", "message": "Alert resolved"}
