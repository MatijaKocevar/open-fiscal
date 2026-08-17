#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <backup_file.sql.gz>"
  exit 1
fi

DB_NAME="${DB_NAME:-openfiscal}"
DB_USER="${DB_USER:-openfiscal}"

gunzip -c "$1" | psql -U "$DB_USER" "$DB_NAME"
echo "Restored from: $1"
