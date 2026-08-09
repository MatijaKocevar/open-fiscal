#!/bin/bash
set -e

echo "=== DPR Fiscal Dev Setup ==="

echo "Starting PostgreSQL..."
docker compose -f docker-compose.dev.yml up -d postgres

echo "Installing Node dependencies..."
cd web && npm install && cd ..

echo "Generating Prisma client..."
cd web && npx prisma generate && cd ..

echo "Running database migrations..."
cd web && npx prisma migrate dev --name init && cd ..

echo "Restoring .NET dependencies..."
cd furs-bridge && dotnet restore && cd ..

echo ""
echo "=== Setup complete ==="
echo "Start the bridge:   dotnet run --project furs-bridge/src"
echo "Start the web app:   cd web && npm run dev"
echo "Open:                http://localhost:3000/setup"
