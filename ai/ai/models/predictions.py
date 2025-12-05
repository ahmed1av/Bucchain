"""
Pydantic models for prediction/detection endpoints
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime


class BoundingBox(BaseModel):
    """Bounding box coordinates for detected objects"""
    x1: float = Field(..., description="Top-left x coordinate")
    y1: float = Field(..., description="Top-left y coordinate")
    x2: float = Field(..., description="Bottom-right x coordinate")
    y2: float = Field(..., description="Bottom-right y coordinate")
    
    @field_validator('x1', 'x2', 'y1', 'y2')
    @classmethod
    def validate_coordinate(cls, v):
        if v < 0:
            raise ValueError("Coordinates must be non-negative")
        return v


class DetectionResult(BaseModel):
    """Single detection result"""
    class_name: str = Field(..., description="Detected class name")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Detection confidence score")
    bounding_box: Optional[BoundingBox] = Field(None, description="Bounding box coordinates")
    
    @field_validator('confidence')
    @classmethod
    def validate_confidence(cls, v):
        return max(0.0, min(1.0, v))


class ImageMetadata(BaseModel):
    """Metadata about the processed image"""
    filename: str = Field(..., description="Original filename")
    width: int = Field(..., gt=0, description="Image width in pixels")
    height: int = Field(..., gt=0, description="Image height in pixels")
    channels: int = Field(..., ge=1, le=4, description="Number of color channels")
    size: int = Field(..., description="Total number of pixels")
    dtype: str = Field(..., description="Data type of image array")


class DetectionResponse(BaseModel):
    """Complete detection response"""
    is_counterfeit: bool = Field(..., description="Whether counterfeit was detected")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Overall confidence score")
    detections: List[DetectionResult] = Field(
        default_factory=list,
        description="List of individual detections"
    )
    image_metadata: ImageMetadata = Field(..., description="Metadata about the processed image")
    processing_time_seconds: float = Field(..., ge=0, description="Processing time in seconds")
    timestamp: datetime = Field(default_factory=datetime.now, description="Response timestamp")
    model_version: str = Field(default="yolov10n", description="Model version used")
    
    class Config:
        json_schema_extra = {
            "example": {
                "is_counterfeit": False,
                "confidence": 0.98,
                "detections": [],
                "image_metadata": {
                    "filename": "product.jpg",
                    "width": 640,
                    "height": 480,
                    "channels": 3,
                    "size": 921600,
                    "dtype": "uint8"
                },
                "processing_time_seconds": 0.45,
                "timestamp": "2025-11-29T00:00:00",
                "model_version": "yolov10n"
            }
        }


class BatchDetectionRequest(BaseModel):
    """Request for batch detection"""
    file_count: int = Field(..., gt=0, le=50, description="Number of files to process")


class BatchDetectionResponse(BaseModel):
    """Response for batch detection"""
    results: List[DetectionResponse] = Field(..., description="Detection results for each image")
    total_processed: int = Field(..., description="Total images processed")
    total_counterfeit: int = Field(..., description="Number of counterfeit items detected")
    average_confidence: float = Field(..., description="Average confidence across all detections")
    total_processing_time_seconds: float = Field(..., description="Total processing time")
