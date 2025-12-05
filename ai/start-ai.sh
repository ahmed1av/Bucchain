#!/bin/bash

# BUCChain AI Service Startup Script
# This script manages the AI service lifecycle with proper error handling

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AI_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$AI_DIR/venv"
PORT=8002
LOG_FILE="$AI_DIR/ai_service.log"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}BUCChain AI Service Startup${NC}"
echo -e "${BLUE}============================================${NC}"

# Function to print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Python 3 is installed
print_info "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
print_success "Python $PYTHON_VERSION found"

# Check if port is available
print_info "Checking if port $PORT is available..."
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port $PORT is already in use"
    read -p "Kill existing process? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        PID=$(lsof -ti:$PORT)
        kill -9 $PID 2>/dev/null || true
        print_success "Killed process on port $PORT"
        sleep 2
    else
        print_error "Cannot start service - port $PORT is in use"
        exit 1
    fi
else
    print_success "Port $PORT is available"
fi

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    print_info "Creating virtual environment..."
    python3 -m venv "$VENV_DIR"
    print_success "Virtual environment created"
else
    print_info "Virtual environment already exists"
fi

# Activate virtual environment
print_info "Activating virtual environment..."
source "$VENV_DIR/bin/activate"
print_success "Virtual environment activated"

# Upgrade pip
print_info "Upgrading pip..."
pip install --upgrade pip -q

# Install/update dependencies
print_info "Installing dependencies from requirements.txt..."
if [ -f "$AI_DIR/requirements.txt" ]; then
    pip install -r "$AI_DIR/requirements.txt" -q
    print_success "Dependencies installed"
else
    print_error "requirements.txt not found in $AI_DIR"
    exit 1
fi

# Verify critical dependencies
print_info "Verifying critical dependencies..."
python3 -c "import fastapi, uvicorn, numpy, cv2" 2>/dev/null
if [ $? -eq 0 ]; then
    print_success "All critical dependencies verified"
else
    print_error "Failed to import required dependencies"
    exit 1
fi

# Start the AI service
print_info "Starting AI service on port $PORT..."
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}AI Service is starting...${NC}"
echo -e "${BLUE}Logs: $LOG_FILE${NC}"
echo -e "${BLUE}Health Check: http://localhost:$PORT/health${NC}"
echo -e "${BLUE}API Docs: http://localhost:$PORT/docs${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Run the service
cd "$AI_DIR"
python3 main.py

# Cleanup on exit
trap 'print_info "Shutting down AI service..."; deactivate' EXIT
