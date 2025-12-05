#!/bin/bash

# ========================================
# Database Backup Script
# ========================================

set -e

echo "💾 Starting Database Backup..."

GREEN='\033[0;32m'
NC='\033[0m'

# Create backup directory
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/vicc_backup_$TIMESTAMP.sql"

# Load environment variables
source .env.production

echo "📦 Creating backup: $BACKUP_FILE"

# Backup using docker exec
docker exec vicc-mysql-prod mysqldump \
    -u $DB_USER \
    -p$DB_PASSWORD \
    $DB_DATABASE > $BACKUP_FILE

# Compress backup
echo "🗜️  Compressing backup..."
gzip $BACKUP_FILE

echo -e "${GREEN}✅ Backup completed: ${BACKUP_FILE}.gz${NC}"

# Clean old backups (keep last 7 days)
echo "🧹 Cleaning old backups (keeping last 7 days)..."
find $BACKUP_DIR -name "vicc_backup_*.sql.gz" -mtime +7 -delete

echo "📊 Available backups:"
ls -lh $BACKUP_DIR/vicc_backup_*.sql.gz
