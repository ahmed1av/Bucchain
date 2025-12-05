"""
BUCChain AI Service - Main Application

AI-powered counterfeit detection service using FastAPI and YOLOv10.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import sys
import logging
from datetime import datetime

# Import configuration and services
from ai.utils.config import settings
from ai.services.ml_service import ml_service
from ai.services.analytics_service import analytics_service

# Import routers
from ai.routes import predictions, analytics

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(settings.log_file)
    ]
)
logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    """
    Create and configure FastAPI application
    
    Returns:
        Configured FastAPI application instance
    """
    app = FastAPI(
        title=settings.app_name,
        description=settings.app_description,
        version=settings.app_version,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json"
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
        max_age=3600,
    )
    
    # Register routers
    # Root and health endpoints (no prefix)
    app.include_router(analytics.router)
    
    # API v1 endpoints
    app.include_router(
        predictions.router,
        prefix=settings.api_v1_prefix,
        tags=["Detection"]
    )
    
    # Additional API v1 analytics endpoints
    analytics_v1_router = FastAPI().router
    analytics_v1_router.routes = [
        route for route in analytics.router.routes
        if route.path.startswith("/analytics")
    ]
    app.include_router(
        analytics.router,
        prefix=settings.api_v1_prefix,
    )
    
    return app


# Create app instance
app = create_app()


@app.on_event("startup")
async def startup_event():
    """Execute startup tasks"""
    logger.info("=" * 60)
    logger.info(f"{settings.app_name} Starting")
    logger.info(f"Timestamp: {datetime.now().isoformat()}")
    logger.info(f"Python Version: {sys.version}")
    logger.info(f"Configuration:")
    logger.info(f"  - Port: {settings.port}")
    logger.info(f"  - Model: {settings.model_name}")
    logger.info(f"  - Model Path: {settings.model_path}")
    logger.info(f"  - Model Exists: {settings.model_exists}")
    logger.info(f"  - API Prefix: {settings.api_v1_prefix}")
    logger.info(f"  - CORS Origins: {settings.cors_origins}")
    logger.info("=" * 60)
    
    # Load ML model
    logger.info("Loading ML model...")
    ml_service.load_model()
    
    if ml_service.is_model_loaded:
        logger.info("✓ Model loaded successfully")
    else:
        logger.warning("⚠ Model not loaded - using mock inference")
    
    logger.info("✓ Startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    """Execute shutdown tasks"""
    logger.info("=" * 60)
    logger.info(f"{settings.app_name} Shutting Down")
    logger.info(f"Timestamp: {datetime.now().isoformat()}")
    
    # Log final statistics
    summary = analytics_service.get_summary()
    logger.info(f"Session Statistics:")
    logger.info(f"  - Total Detections: {summary.total_detections}")
    logger.info(f"  - Total Counterfeit: {summary.total_counterfeit}")
    logger.info(f"  - Average Confidence: {summary.average_confidence:.2f}")
    logger.info(f"  - Uptime: {summary.uptime_seconds:.2f}s")
    logger.info("=" * 60)


if __name__ == "__main__":
    logger.info(f"Starting {settings.app_name} on port {settings.port}...")
    uvicorn.run(
        app,
        host=settings.host,
        port=settings.port,
        log_level=settings.log_level.lower(),
        access_log=True
    )
