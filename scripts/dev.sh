#!/bin/bash
set -e

# Start the FURS bridge (mock mode by default) in the background.
dotnet run --project furs-bridge/src --launch-profile http &
BRIDGE_PID=$!

cleanup() {
  kill "$BRIDGE_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Run the web app in the foreground.
cd web
npm run dev
