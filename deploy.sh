#!/bin/bash

# ========================================
# Production Deployment Script
# ========================================

set -e  # Exit on error

echo "🚀 Starting Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Error: .env.production file not found!${NC}"
    echo -e "${YELLOW}Please copy .env.production.example to .env.production and configure it.${NC}"
    exit 1
fi

if [ ! -f backend/.env.production ]; then
    echo -e "${RED}❌ Error: backend/.env.production file not found!${NC}"
    exit 1
fi

if [ ! -f datacore-factory/.env.production ]; then
    echo -e "${RED}❌ Error: datacore-factory/.env.production file not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment files found${NC}"

# Pull latest code (optional)
read -p "Do you want to pull latest code from git? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📥 Pulling latest code..."
    git pull
    echo -e "${GREEN}✓ Code updated${NC}"
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.production.yml down

# Remove old images (optional)
read -p "Do you want to remove old images? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing old images..."
    docker-compose -f docker-compose.production.yml down --rmi all
fi

# Build and start containers
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.production.yml build --no-cache

echo "🚀 Starting containers..."
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check container status
echo "📊 Container Status:"
docker-compose -f docker-compose.production.yml ps

# Health checks
echo ""
echo "🏥 Health Checks:"

# Check backend
echo -n "Backend: "
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Healthy${NC}"
else
    echo -e "${RED}✗ Not responding${NC}"
fi

# Check frontend
echo -n "Frontend: "
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Healthy${NC}"
else
    echo -e "${RED}✗ Not responding${NC}"
fi

echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo "📝 Useful commands:"
echo "  View logs:        docker-compose -f docker-compose.production.yml logs -f"
echo "  Stop services:    docker-compose -f docker-compose.production.yml down"
echo "  Restart services: docker-compose -f docker-compose.production.yml restart"
echo "  View status:      docker-compose -f docker-compose.production.yml ps"
echo ""
echo "🌐 Access your application:"
echo "  Frontend: http://localhost"
echo "  Backend:  http://localhost:5000"
