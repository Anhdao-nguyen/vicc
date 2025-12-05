#!/bin/bash

# ========================================
# Rollback Script - Quay lại phiên bản trước
# ========================================

set -e

echo "🔙 Starting Rollback..."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Stop current containers
echo "🛑 Stopping current containers..."
docker-compose -f docker-compose.production.yml down

# Get previous git commit
echo "📜 Available recent commits:"
git log --oneline -n 5

echo ""
read -p "Enter commit hash to rollback to: " COMMIT_HASH

if [ -z "$COMMIT_HASH" ]; then
    echo -e "${RED}❌ No commit hash provided. Aborting.${NC}"
    exit 1
fi

# Checkout to previous commit
echo "⏮️  Rolling back to commit $COMMIT_HASH..."
git checkout $COMMIT_HASH

# Rebuild and restart
echo "🔨 Rebuilding containers..."
docker-compose -f docker-compose.production.yml build

echo "🚀 Starting containers..."
docker-compose -f docker-compose.production.yml up -d

echo ""
echo -e "${GREEN}✅ Rollback completed!${NC}"
echo -e "${YELLOW}⚠️  Remember: You are now in detached HEAD state${NC}"
echo "To return to main branch: git checkout main"
