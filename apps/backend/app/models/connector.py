from sqlalchemy import Column, Integer, String, Boolean, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base

class Connector(Base):
    __tablename__ = "connectors"

    id = Column(Integer, primary_key=True, index=True)
    app_id = Column(String, ForeignKey("applications.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # 'docker' or 's3'
    config = Column(JSON, nullable=False) # Contains type-specific config like endpoint, bucket, etc.
    is_active = Column(Boolean, default=True)
    
    last_sync_at = Column(DateTime(timezone=True), nullable=True)
    last_status = Column(String, nullable=True) # 'connected', 'error', 'stale'
    last_error = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    application = relationship("Application", back_populates="connectors")
