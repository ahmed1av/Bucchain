"""
Prediction/Detection API Routes

Handles image upload and counterfeit detection endpoints.
"""

from fastapi import APIRouter, File, UploadFile, HTTPException
from typing import List
import logging

from ai.models.predictions import DetectionResponse, BatchDetectionResponse
from ai.services.ml_service import ml_service
from ai.services.analytics_service import analytics_service
from ai.utils.helpers import validate_and_decode_image

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/detect",
    tags=["Detection"],
    responses={
        400: {"description": "Invalid input"},
        500: {"description": "Internal server error"}
    }
)


@router.post(
    "",
    response_model=DetectionResponse,
    summary="Detect counterfeit products",
    description="""
    Upload an image to detect counterfeit products using AI.
    
    The service analyzes the image and returns:
    - Whether the product appears to be counterfeit
    - Confidence score for the detection
    - Detailed detection results with bounding boxes (if applicable)
    - Image metadata and processing information
    
    Supported image formats: JPEG, PNG, WebP, BMP
    Maximum file size: 10MB
    """
)
async def detect_counterfeit(
    file: UploadFile = File(..., description="Image file to analyze")
) -> DetectionResponse:
    """
    Detect counterfeit products in an uploaded image
    
    Args:
        file: Uploaded image file
        
    Returns:
        DetectionResponse with analysis results
        
    Raises:
        HTTPException: If validation or processing fails
    """
    try:
        # Validate and decode image
        img = await validate_and_decode_image(file)
        
        # Perform detection
        result = await ml_service.detect(img, file.filename or "unknown.jpg")
        
        # Record analytics
        analytics_service.record_detection(
            filename=result.image_metadata.filename,
            is_counterfeit=result.is_counterfeit,
            confidence=result.confidence,
            processing_time=result.processing_time_seconds
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing detection request: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@router.post(
    "/batch",
    response_model=BatchDetectionResponse,
    summary="Batch detect counterfeit products",
    description="""
    Upload multiple images for batch counterfeit detection.
    
    Maximum 50 images per batch request.
    Each image is processed individually and results are aggregated.
    """
)
async def batch_detect_counterfeit(
    files: List[UploadFile] = File(..., description="Multiple image files to analyze")
) -> BatchDetectionResponse:
    """
    Perform batch detection on multiple images
    
    Args:
        files: List of uploaded image files (max 50)
        
    Returns:
        BatchDetectionResponse with aggregated results
        
    Raises:
        HTTPException: If validation or processing fails
    """
    try:
        # Validate batch size
        if len(files) > 50:
            raise HTTPException(
                status_code=400,
                detail="Maximum 50 images per batch request"
            )
        
        if len(files) == 0:
            raise HTTPException(
                status_code=400,
                detail="No files provided"
            )
        
        # Process each image
        results = []
        total_processing_time = 0.0
        
        for file in files:
            try:
                img = await validate_and_decode_image(file)
                result = await ml_service.detect(img, file.filename or "unknown.jpg")
                results.append(result)
                total_processing_time += result.processing_time_seconds
                
                # Record analytics
                analytics_service.record_detection(
                    filename=result.image_metadata.filename,
                    is_counterfeit=result.is_counterfeit,
                    confidence=result.confidence,
                    processing_time=result.processing_time_seconds
                )
                
            except Exception as e:
                logger.error(f"Error processing file {file.filename}: {e}")
                # Continue processing other files
                continue
        
        # Calculate aggregates
        total_counterfeit = sum(1 for r in results if r.is_counterfeit)
        avg_confidence = sum(r.confidence for r in results) / len(results) if results else 0.0
        
        return BatchDetectionResponse(
            results=results,
            total_processed=len(results),
            total_counterfeit=total_counterfeit,
            average_confidence=avg_confidence,
            total_processing_time_seconds=total_processing_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing batch detection request: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )
