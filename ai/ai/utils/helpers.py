"""
Utility helper functions for BUCChain AI Service
"""

import numpy as np
import cv2
from typing import Optional, Tuple
from fastapi import UploadFile, HTTPException
import logging

logger = logging.getLogger(__name__)

# Supported image MIME types
SUPPORTED_IMAGE_TYPES = {
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/bmp'
}

# Maximum file size (10MB)
MAX_FILE_SIZE = 10 * 1024 * 1024


async def validate_and_decode_image(
    file: UploadFile,
    max_size: int = MAX_FILE_SIZE
) -> np.ndarray:
    """
    Validate and decode uploaded image file
    
    Args:
        file: Uploaded file from FastAPI
        max_size: Maximum allowed file size in bytes
        
    Returns:
        Decoded image as numpy array (BGR format)
        
    Raises:
        HTTPException: If validation fails
    """
    # Validate content type
    if not file.content_type or file.content_type not in SUPPORTED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. "
                   f"Supported types: {', '.join(SUPPORTED_IMAGE_TYPES)}"
        )
    
    # Read file contents
    contents = await file.read()
    
    # Validate file size
    if len(contents) == 0:
        raise HTTPException(
            status_code=400,
            detail="Empty file uploaded"
        )
    
    if len(contents) > max_size:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {max_size / (1024 * 1024):.1f}MB"
        )
    
    # Decode image
    try:
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Failed to decode image")
        
        logger.info(f"Successfully decoded image: {file.filename}, shape: {img.shape}")
        return img
        
    except Exception as e:
        logger.error(f"Error decoding image: {e}")
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image data: {str(e)}"
        )


def preprocess_image(
    img: np.ndarray,
    target_size: Optional[Tuple[int, int]] = None
) -> np.ndarray:
    """
    Preprocess image for model inference
    
    Args:
        img: Input image (BGR format)
        target_size: Optional target size (width, height)
        
    Returns:
        Preprocessed image
    """
    if target_size:
        img = cv2.resize(img, target_size)
    
    # Additional preprocessing can be added here
    # e.g., normalization, color space conversion, etc.
    
    return img


def validate_confidence(confidence: float) -> float:
    """
    Validate and clamp confidence value
    
    Args:
        confidence: Confidence value to validate
        
    Returns:
        Validated confidence value between 0 and 1
    """
    return max(0.0, min(1.0, confidence))


def format_image_metadata(img: np.ndarray, filename: str) -> dict:
    """
    Extract and format image metadata
    
    Args:
        img: Image array
        filename: Original filename
        
    Returns:
        Dictionary with image metadata
    """
    height, width = img.shape[:2]
    channels = img.shape[2] if len(img.shape) == 3 else 1
    
    return {
        "filename": filename,
        "width": width,
        "height": height,
        "channels": channels,
        "size": img.size,
        "dtype": str(img.dtype)
    }
