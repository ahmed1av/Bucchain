"""
Pydantic models for analytics endpoints
"""

from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(..., description="Service status")
    model: str = Field(..., description="Model name")
    model_loaded: bool = Field(..., description="Whether model is loaded")
    timestamp: datetime = Field(default_factory=datetime.now, description="Check timestamp")
    dependencies: Dict[str, str] = Field(..., description="Dependency versions")
    uptime_seconds: Optional[float] = Field(None, description="Service uptime in seconds")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "online",
                "model": "yolov10n",
                "model_loaded": True,
                "timestamp": "2025-11-29T00:00:00",
                "dependencies": {
                    "numpy": "2.2.1",
                    "opencv": "4.10.0"
                },
                "uptime_seconds": 3600.5
            }
        }


class ServiceInfoResponse(BaseModel):
    """Service information response"""
    status: str = Field(..., description="Service status")
    service: str = Field(..., description="Service name")
    version: str = Field(..., description="Service version")
    timestamp: datetime = Field(default_factory=datetime.now, description="Response timestamp")
    endpoints: List[str] = Field(default_factory=list, description="Available endpoints")


class AnalyticsSummary(BaseModel):
    """Overall analytics summary"""
    total_detections: int = Field(default=0, description="Total number of detections performed")
    total_counterfeit: int = Field(default=0, description="Total counterfeit items detected")
    average_confidence: float = Field(default=0.0, description="Average confidence score")
    average_processing_time: float = Field(default=0.0, description="Average processing time in seconds")
    uptime_seconds: float = Field(..., description="Service uptime")
    timestamp: datetime = Field(default_factory=datetime.now, description="Summary timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_detections": 1250,
                "total_counterfeit": 15,
                "average_confidence": 0.95,
                "average_processing_time": 0.42,
                "uptime_seconds": 86400,
                "timestamp": "2025-11-29T00:00:00"
            }
        }


class RecentDetection(BaseModel):
    """Recent detection entry"""
    timestamp: datetime = Field(..., description="Detection timestamp")
    filename: str = Field(..., description="Image filename")
    is_counterfeit: bool = Field(..., description="Detection result")
    confidence: float = Field(..., description="Confidence score")
    processing_time: float = Field(..., description="Processing time in seconds")


class RecentDetectionsResponse(BaseModel):
    """Response with recent detections"""
    detections: List[RecentDetection] = Field(..., description="List of recent detections")
    count: int = Field(..., description="Number of detections returned")
    timestamp: datetime = Field(default_factory=datetime.now, description="Response timestamp")


class AnalyticsRequest(BaseModel):
    """Analytics query request"""
    limit: int = Field(default=10, ge=1, le=100, description="Maximum number of results")
    offset: int = Field(default=0, ge=0, description="Offset for pagination")
