"""
Analytics API Routes

Provides monitoring, health checks, and analytics endpoints.
"""

from fastapi import APIRouter, Query
from datetime import datetime
import logging
import numpy as np
import cv2

from ai.models.analytics import (
    HealthResponse,
    ServiceInfoResponse,
    AnalyticsSummary,
    RecentDetectionsResponse,
    AnalyticsRequest
)
from ai.services.analytics_service import analytics_service
from ai.services.ml_service import ml_service
from ai.utils.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["Analytics & Monitoring"]
)


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Check the health status of the AI service and its dependencies"
)
async def health_check() -> HealthResponse:
    """
    Perform health check on the service
    
    Returns:
        HealthResponse with service status and dependency information
    """
    try:
        # Verify dependencies are working
        _ = np.array([1, 2, 3])
        _ = np.zeros((10, 10, 3), dtype=np.uint8)
        
        return HealthResponse(
            status="online",
            model=settings.model_name,
            model_loaded=ml_service.is_model_loaded,
            timestamp=datetime.now(),
            dependencies={
                "numpy": np.__version__,
                "opencv": cv2.__version__,
                "fastapi": "0.115.6",
                "pydantic": "2.10.5"
            },
            uptime_seconds=analytics_service.get_uptime()
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}", exc_info=True)
        return HealthResponse(
            status="degraded",
            model=settings.model_name,
            model_loaded=False,
            timestamp=datetime.now(),
            dependencies={},
            uptime_seconds=analytics_service.get_uptime()
        )


@router.get(
    "/",
    response_model=ServiceInfoResponse,
    summary="Service information",
    description="Get basic information about the AI service"
)
async def root() -> ServiceInfoResponse:
    """
    Get service information
    
    Returns:
        ServiceInfoResponse with service details
    """
    return ServiceInfoResponse(
        status="AI Service Online",
        service=settings.app_name,
        version=settings.app_version,
        timestamp=datetime.now(),
        endpoints=[
            "/health",
            "/api/v1/detect",
            "/api/v1/detect/batch",
            "/api/v1/analytics/summary",
            "/api/v1/analytics/recent",
            "/docs"
        ]
    )


@router.get(
    "/analytics/summary",
    response_model=AnalyticsSummary,
    summary="Analytics summary",
    description="Get aggregated analytics and statistics about detection operations"
)
async def get_analytics_summary() -> AnalyticsSummary:
    """
    Get overall analytics summary
    
    Returns:
        AnalyticsSummary with aggregated statistics
    """
    return analytics_service.get_summary()


@router.get(
    "/analytics/recent",
    response_model=RecentDetectionsResponse,
    summary="Recent detections",
    description="Get a list of recent detection operations with pagination"
)
async def get_recent_detections(
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Maximum number of results to return"
    ),
    offset: int = Query(
        default=0,
        ge=0,
        description="Offset for pagination"
    )
) -> RecentDetectionsResponse:
    """
    Get recent detections with pagination
    
    Args:
        limit: Maximum number of results (1-100)
        offset: Offset for pagination
        
    Returns:
        RecentDetectionsResponse with recent detection records
    """
    return analytics_service.get_recent_detections(limit=limit, offset=offset)
