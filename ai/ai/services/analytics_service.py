"""
Analytics Service for BUCChain AI

Tracks and provides statistics about detection operations.
"""

import logging
from typing import List
from datetime import datetime
from collections import deque

from ai.models.analytics import (
    AnalyticsSummary,
    RecentDetection,
    RecentDetectionsResponse
)

logger = logging.getLogger(__name__)


class AnalyticsService:
    """Service for tracking analytics and metrics"""
    
    def __init__(self, max_recent: int = 100):
        """
        Initialize analytics service
        
        Args:
            max_recent: Maximum number of recent detections to store
        """
        self.start_time = datetime.now()
        self.total_detections = 0
        self.total_counterfeit = 0
        self.total_processing_time = 0.0
        self.total_confidence = 0.0
        
        # Store recent detections using deque for efficient operations
        self.recent_detections: deque[RecentDetection] = deque(maxlen=max_recent)
    
    def record_detection(
        self,
        filename: str,
        is_counterfeit: bool,
        confidence: float,
        processing_time: float
    ):
        """
        Record a detection event
        
        Args:
            filename: Image filename
            is_counterfeit: Whether counterfeit was detected
            confidence: Detection confidence
            processing_time: Processing time in seconds
        """
        self.total_detections += 1
        if is_counterfeit:
            self.total_counterfeit += 1
        
        self.total_processing_time += processing_time
        self.total_confidence += confidence
        
        # Add to recent detections
        detection = RecentDetection(
            timestamp=datetime.now(),
            filename=filename,
            is_counterfeit=is_counterfeit,
            confidence=confidence,
            processing_time=processing_time
        )
        self.recent_detections.append(detection)
        
        logger.debug(
            f"Recorded detection: {filename}, "
            f"counterfeit={is_counterfeit}, "
            f"total_count={self.total_detections}"
        )
    
    def get_summary(self) -> AnalyticsSummary:
        """
        Get overall analytics summary
        
        Returns:
            AnalyticsSummary with aggregated statistics
        """
        uptime = (datetime.now() - self.start_time).total_seconds()
        
        avg_confidence = (
            self.total_confidence / self.total_detections
            if self.total_detections > 0
            else 0.0
        )
        
        avg_processing_time = (
            self.total_processing_time / self.total_detections
            if self.total_detections > 0
            else 0.0
        )
        
        return AnalyticsSummary(
            total_detections=self.total_detections,
            total_counterfeit=self.total_counterfeit,
            average_confidence=avg_confidence,
            average_processing_time=avg_processing_time,
            uptime_seconds=uptime,
            timestamp=datetime.now()
        )
    
    def get_recent_detections(
        self,
        limit: int = 10,
        offset: int = 0
    ) -> RecentDetectionsResponse:
        """
        Get recent detections with pagination
        
        Args:
            limit: Maximum number of results
            offset: Offset for pagination
            
        Returns:
            RecentDetectionsResponse with recent detections
        """
        # Convert deque to list for slicing
        all_detections = list(self.recent_detections)
        
        # Reverse to show most recent first
        all_detections.reverse()
        
        # Apply pagination
        paginated = all_detections[offset:offset + limit]
        
        return RecentDetectionsResponse(
            detections=paginated,
            count=len(paginated),
            timestamp=datetime.now()
        )
    
    def get_uptime(self) -> float:
        """
        Get service uptime in seconds
        
        Returns:
            Uptime in seconds
        """
        return (datetime.now() - self.start_time).total_seconds()
    
    def reset_stats(self):
        """Reset all statistics (for testing/maintenance)"""
        logger.warning("Resetting analytics statistics")
        self.start_time = datetime.now()
        self.total_detections = 0
        self.total_counterfeit = 0
        self.total_processing_time = 0.0
        self.total_confidence = 0.0
        self.recent_detections.clear()


# Global analytics service instance
analytics_service = AnalyticsService()
