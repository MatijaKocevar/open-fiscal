#!/bin/bash
set -e

BACKUP_DIR="./backups"
DB_NAME="${DB_NAME:-openfiscal}"
DB_USER="${DB_USER:-openfiscal}"
TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)

mkdir -p "$BACKUP_DIR"

pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"
tar -czf "${BACKUP_DIR}/certs_${TIMESTAMP}.tar.gz" -C . certs/

echo "Backup saved: ${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"
