"""
Machine Learning Service for BUCChain AI

Handles model loading, inference, and result post-processing.
"""

import numpy as np
import cv2
import time
import logging
from typing import List, Tuple, Optional
from datetime import datetime

from ai.models.predictions import DetectionResult, DetectionResponse, ImageMetadata, BoundingBox
from ai.utils.config import settings
from ai.utils.helpers import preprocess_image, format_image_metadata

logger = logging.getLogger(__name__)


class MLService:
    """Machine Learning inference service"""
    
    def __init__(self):
        self.model = None
        self.model_name = settings.model_name
        self.model_path = settings.model_path
        self.confidence_threshold = settings.confidence_threshold
        self._model_loaded = False
        
    def load_model(self):
        """
        Load the ML model (YOLOv10)
        
        Note: Currently a placeholder until model weights are available.
        When ready, uncomment the ultralytics import and model loading.
        """
        try:
            if settings.model_exists:
                # TODO: Uncomment when model weights are available
                # from ultralytics import YOLO
                # self.model = YOLO(self.model_path)
                # self._model_loaded = True
                # logger.info(f"Model loaded successfully: {self.model_name}")
                
                logger.warning(
                    f"Model file found at {self.model_path} but loading is disabled. "
                    "Using mock inference."
                )
            else:
                logger.warning(
                    f"Model weights not found at {self.model_path}. "
                    "Using mock inference. To enable real detection, "
                    "download YOLOv10 weights to the models/weights directory."
                )
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            logger.warning("Falling back to mock inference")
    
    @property
    def is_model_loaded(self) -> bool:
        """Check if model is loaded"""
        return self._model_loaded
    
    async def detect(
        self,
        img: np.ndarray,
        filename: str
    ) -> DetectionResponse:
        """
        Perform counterfeit detection on an image
        
        Args:
            img: Input image (BGR format)
            filename: Original filename
            
        Returns:
            DetectionResponse with results and metadata
        """
        start_time = time.time()
        
        try:
            # Preprocess image
            processed_img = preprocess_image(img)
            
            if self._model_loaded and self.model is not None:
                # Real inference
                detections = await self._run_inference(processed_img)
            else:
                # Mock inference
                detections = self._mock_inference(processed_img)
            
            # Calculate overall confidence and counterfeit status
            is_counterfeit = len(detections) > 0
            confidence = max([d.confidence for d in detections]) if detections else 0.98
            
            # Get image metadata
            metadata_dict = format_image_metadata(img, filename)
            image_metadata = ImageMetadata(**metadata_dict)
            
            processing_time = time.time() - start_time
            
            response = DetectionResponse(
                is_counterfeit=is_counterfeit,
                confidence=confidence,
                detections=detections,
                image_metadata=image_metadata,
                processing_time_seconds=processing_time,
                timestamp=datetime.now(),
                model_version=self.model_name
            )
            
            logger.info(
                f"Detection completed: {filename}, "
                f"counterfeit={is_counterfeit}, "
                f"confidence={confidence:.2f}, "
                f"time={processing_time:.2f}s"
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Error during detection: {e}", exc_info=True)
            raise
    
    async def _run_inference(self, img: np.ndarray) -> List[DetectionResult]:
        """
        Run actual model inference
        
        Args:
            img: Preprocessed image
            
        Returns:
            List of detection results
        """
        # TODO: Implement when model is loaded
        # results = self.model(img, conf=self.confidence_threshold)
        # detections = []
        # for r in results:
        #     boxes = r.boxes
        #     for box in boxes:
        #         x1, y1, x2, y2 = box.xyxy[0].tolist()
        #         conf = float(box.conf[0])
        #         cls = int(box.cls[0])
        #         class_name = self.model.names[cls]
        #         
        #         detection = DetectionResult(
        #             class_name=class_name,
        #             confidence=conf,
        #             bounding_box=BoundingBox(x1=x1, y1=y1, x2=x2, y2=y2)
        #         )
        #         detections.append(detection)
        # 
        # return detections
        
        return []
    
    def _mock_inference(self, img: np.ndarray) -> List[DetectionResult]:
        """
        Mock inference for testing/demo purposes
        
        Args:
            img: Input image
            
        Returns:
            List of mock detection results (empty list = genuine product)
        """
        # Simulate processing time
        time.sleep(0.1)
        
        # Return empty list (no counterfeit detected)
        # In a real scenario, this would return detected objects
        return []
    
    async def batch_detect(
        self,
        images: List[Tuple[np.ndarray, str]]
    ) -> List[DetectionResponse]:
        """
        Perform batch detection on multiple images
        
        Args:
            images: List of (image, filename) tuples
            
        Returns:
            List of detection responses
        """
        results = []
        for img, filename in images:
            result = await self.detect(img, filename)
            results.append(result)
        
        return results


# Global service instance
ml_service = MLService()
