#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <backup_file.sql.gz>"
  exit 1
fi

DB_NAME="${DB_NAME:-dpr_fiscal}"
DB_USER="${DB_USER:-dpr}"

gunzip -c "$1" | psql -U "$DB_USER" "$DB_NAME"
echo "Restored from: $1"
