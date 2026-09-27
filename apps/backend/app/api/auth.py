"""
OneView Monitor — Auth API

JWT authentication with login, logout, refresh, and current user.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status, Depends

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
    get_current_user,
)
from app.schemas.schemas import LoginRequest, TokenResponse, UserResponse

router = APIRouter()

# In-memory users for Phase 1 (replaced with DB in Phase 5)
_SEED_USERS = {
    "admin": {
        "id": "user_admin",
        "username": "admin",
        "email": "admin@baxter.com",
        "password_hash": hash_password("admin123"),
        "role": "admin",
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    "operator": {
        "id": "user_operator",
        "username": "operator",
        "email": "operator@baxter.com",
        "password_hash": hash_password("operator123"),
        "role": "operator",
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    "viewer": {
        "id": "user_viewer",
        "username": "viewer",
        "email": "viewer@baxter.com",
        "password_hash": hash_password("viewer123"),
        "role": "viewer",
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
}


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Authenticate user and return JWT tokens."""
    user = _SEED_USERS.get(request.username)
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )

    token_data = {
        "sub": user["id"],
        "username": user["username"],
        "email": user["email"],
        "role": user["role"],
    }
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )


@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout — invalidate session (Redis-based in production)."""
    return {"message": "Logged out successfully"}


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str):
    """Refresh access token using a valid refresh token."""
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    token_data = {
        "sub": payload["sub"],
        "username": payload["username"],
        "email": payload["email"],
        "role": payload["role"],
    }
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Return current authenticated user details."""
    return {
        "id": current_user["sub"],
        "username": current_user["username"],
        "email": current_user["email"],
        "role": current_user["role"],
    }
