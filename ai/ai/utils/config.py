"""
Configuration management for BUCChain AI Service

Uses Pydantic settings for type-safe environment variable handling.
"""

import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Application Info
    app_name: str = "BUCChain AI Service"
    app_version: str = "1.0.0"
    app_description: str = "AI-powered counterfeit detection service"
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8002
    reload: bool = False
    
    # CORS Settings
    allowed_origins: str = "http://localhost:8000,http://localhost:3000"
    
    # Model Configuration
    model_name: str = "yolov10n"
    model_path: str = "./models/weights/yolov10n.pt"
    confidence_threshold: float = 0.5
    
    # API Configuration
    api_v1_prefix: str = "/api/v1"
    
    # Logging
    log_level: str = "INFO"
    log_file: str = "ai_service.log"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )
    
    @property
    def cors_origins(self) -> List[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.allowed_origins.split(",")]
    
    @property
    def model_exists(self) -> bool:
        """Check if model weights file exists"""
        return os.path.exists(self.model_path)


# Global settings instance
settings = Settings()
