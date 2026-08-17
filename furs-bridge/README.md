# furs-bridge

C# .NET 8 Minimal API that handles FURS (Slovenian tax authority) fiscalization:
ZOI calculation, JWS signing, and communication with the FURS API over mTLS.

## Prerequisites

- .NET 8 SDK

## Run

```bash
dotnet run --project furs-bridge/src            # defaults to mock mode, port 5100
dotnet run --project furs-bridge/src --launch-profile http
```

In **mock mode** (`BRIDGE_MOCK=true`) the bridge returns deterministic fake
EOR/ZOI/JIR and does not contact FURS. This is the default and requires no
certificates.

## Configuration

Configuration comes from environment variables (no dedicated config file is
required beyond `appsettings.json`).

| Variable | Default | Description |
|----------|---------|-------------|
| `BRIDGE_MOCK` | `true` | `false` enables real FURS communication with certificates |
| `FURS_BASE_URL` | `https://blagajne-test.fu.gov.si:9002` | FURS API base URL |
| `CERT_STORE_PATH` | `/certs` | Directory containing the application certificate |
| `CERT_PASSWORD` | `` | Password for `app-cert.pfx` |
| `TAX_NUMBER` | `` | Business tax number |
| `PREMISE_ID` | `` | Business premise ID |
| `DEVICE_ID` | `` | Electronic device ID |

Real (non-mock) mode requires `CERT_STORE_PATH/app-cert.pfx` to load successfully,
otherwise startup fails.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/health` | Health check (`{ ok, mock }`) |
| `POST` | `/api/invoice` | Submit an invoice, returns EOR/ZOI/JIR |
| `POST` | `/api/premise/register` | Register a business premise |
| `POST` | `/api/premise/close` | Close a business premise |
| `POST` | `/api/echo` | Echo/ping test |
| `POST` | `/api/daily-report` | Submit a daily report |
| `GET` | `/api/device-info` | Current device/premise/tax config |

## Tests

xUnit tests live in `../furs-bridge-tests/`:

```bash
dotnet test furs-bridge-tests/Unit
dotnet test furs-bridge-tests/Integration
```

## Docker

```bash
docker build -t furs-bridge ./furs-bridge
docker run -p 8080:8080 -e BRIDGE_MOCK=true furs-bridge
```

The bridge listens on port 8080 inside the container (mapped to `127.0.0.1:5100`
by the root `docker-compose.yml`).
