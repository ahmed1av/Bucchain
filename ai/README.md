# BUCChain AI Service - Quick Start Guide

## Starting the Service

### Option 1: Using the startup script (Recommended)

```bash
cd /home/ahmed1av/.gemini/antigravity/scratch/BUCChain/ai
./start-ai.sh
```

This script will:

- Check Python installation
- Create/activate virtual environment
- Install dependencies
- Start the service on port 8002

### Option 2: Manual start

```bash
cd /home/ahmed1av/.gemini/antigravity/scratch/BUCChain/ai
source venv/bin/activate
python main.py
```

## API Endpoints

### Base URL

```
http://localhost:8002
```

### Service Information

```bash
# Get service info and available endpoints
curl http://localhost:8002/

# Health check
curl http://localhost:8002/health
```

### Detection

```bash
# Single image detection
curl -X POST http://localhost:8002/api/v1/detect \
  -F "file=@/path/to/image.jpg"

# Batch detection (multiple images)
curl -X POST http://localhost:8002/api/v1/detect/batch \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg" \
  -F "files=@image3.jpg"
```

### Analytics

```bash
# Get overall statistics
curl http://localhost:8002/api/v1/analytics/summary

# Get recent detections (with pagination)
curl "http://localhost:8002/api/v1/analytics/recent?limit=10&offset=0"
```

### Documentation

```bash
# Swagger UI
http://localhost:8002/docs

# ReDoc
http://localhost:8002/redoc

# OpenAPI Schema
http://localhost:8002/openapi.json
```

## Configuration

Create a `.env` file in the project root to customize settings:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8002

# CORS
ALLOWED_ORIGINS=http://localhost:8000,http://localhost:3000

# Model Configuration
MODEL_NAME=yolov10n
MODEL_PATH=./models/weights/yolov10n.pt
CONFIDENCE_THRESHOLD=0.5

# Logging
LOG_LEVEL=INFO
LOG_FILE=ai_service.log
```

## Supported Image Formats

- JPEG (image/jpeg, image/jpg)
- PNG (image/png)
- WebP (image/webp)
- BMP (image/bmp)

**Maximum file size:** 10MB

## Response Format

### Detection Response

```json
{
  "is_counterfeit": false,
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
```

## Troubleshooting

### Port Already in Use

If port 8002 is already in use:

```bash
# Find and kill the process
lsof -ti:8002 | xargs kill -9
```

### Dependencies Not Installed

```bash
cd /home/ahmed1av/.gemini/antigravity/scratch/BUCChain/ai
source venv/bin/activate
pip install -r requirements.txt
```

### Model Not Loading

The service will work with mock inference if model weights are not found. To use real detection:

1. Download YOLOv10 weights
2. Place in `models/weights/yolov10n.pt`
3. Uncomment model loading code in `ai/services/ml_service.py`
4. Install ultralytics: `pip install ultralytics`

## Development

### Project Structure

```
ai/
├── ai/                    # Main package
│   ├── models/           # Pydantic models
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   └── utils/            # Utilities
├── main.py               # Application entry
└── requirements.txt      # Dependencies
```

### Adding New Endpoints

1. Create route in `ai/routes/`
2. Import and register in `main.py`
3. Create Pydantic models in `ai/models/`
4. Add business logic in `ai/services/`

### Testing

```bash
# Health check
curl http://localhost:8002/health

# Test with sample image
curl -X POST http://localhost:8002/api/v1/detect \
  -F "file=@test_image.jpg" | python3 -m json.tool
```
