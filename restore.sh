#!/bin/bash

# ========================================
# Database Restore Script
# ========================================

set -e

echo "♻️  Starting Database Restore..."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

BACKUP_DIR="./backups"

# List available backups
echo "📋 Available backups:"
ls -lh $BACKUP_DIR/vicc_backup_*.sql.gz 2>/dev/null || {
    echo -e "${RED}❌ No backups found in $BACKUP_DIR${NC}"
    exit 1
}

echo ""
read -p "Enter backup filename (e.g., vicc_backup_20250105_120000.sql.gz): " BACKUP_FILE

if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Backup file not found: $BACKUP_DIR/$BACKUP_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  WARNING: This will overwrite the current database!${NC}"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Load environment variables
source .env.production

# Decompress if needed
RESTORE_FILE="$BACKUP_DIR/${BACKUP_FILE%.gz}"
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "📦 Decompressing backup..."
    gunzip -c "$BACKUP_DIR/$BACKUP_FILE" > "$RESTORE_FILE"
else
    RESTORE_FILE="$BACKUP_DIR/$BACKUP_FILE"
fi

# Restore database
echo "♻️  Restoring database..."
docker exec -i vicc-mysql-prod mysql \
    -u $DB_USER \
    -p$DB_PASSWORD \
    $DB_DATABASE < "$RESTORE_FILE"

# Clean up decompressed file if it was created
if [[ $BACKUP_FILE == *.gz ]]; then
    rm "$RESTORE_FILE"
fi

echo -e "${GREEN}✅ Database restored successfully!${NC}"
