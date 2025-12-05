#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting BUCChain Development Environment...${NC}"

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${RED}🛑 Stopping services...${NC}"
    kill $(jobs -p) 2>/dev/null
    echo -e "${GREEN}✅ Services stopped.${NC}"
    exit
}

# Trap SIGINT (Ctrl+C)
trap cleanup SIGINT

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Start Database Services
echo -e "${BLUE}📦 Starting Database Services (PostgreSQL & Redis)...${NC}"
docker-compose up -d postgres redis

# Wait for DB to be ready (simple sleep for now, could be more robust)
echo -e "${BLUE}⏳ Waiting for databases to initialize...${NC}"
sleep 5

# Start Backend
echo -e "${BLUE}🔙 Starting Backend Service...${NC}"
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# Start Frontend
echo -e "${BLUE}🎨 Starting Frontend Service...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}✅ All services started!${NC}"
echo -e "${GREEN}🌍 Frontend: http://localhost:8000${NC}"
echo -e "${GREEN}🔌 Backend:  http://localhost:8001${NC}"
echo -e "${BLUE}📝 Press Ctrl+C to stop all services.${NC}"

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
