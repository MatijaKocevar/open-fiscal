# DPR Fiscal Invoice

Point-of-sale and fiscal-invoice application for the Slovenian tax authority (FURS).
Consists of a Next.js web app and a C# fiscalization bridge.

## Projects

| Directory | Description |
|-----------|-------------|
| `web/` | Next.js 16 App Router — UI + business logic (see [`web/README.md`](web/README.md)) |
| `furs-bridge/` | C# .NET 8 Minimal API — FURS fiscalization (see [`furs-bridge/README.md`](furs-bridge/README.md)) |
| `furs-bridge-tests/` | xUnit tests for the bridge |
| `certs/` | TLS certificates (gitignored, mounted into the bridge) |
| `scripts/` | Setup, dev, backup, restore scripts |
| `docs/` | DPR technical specification |

## Prerequisites

- Docker & Docker Compose (for PostgreSQL)
- Node.js 20+
- .NET 8 SDK

## Setup

```bash
cp .env.example .env    # review and adjust defaults
make setup              # postgres, npm install, prisma generate + migrate, dotnet restore
```

For local development the web app also reads its own `web/.env` (create it with the
`DATABASE_URL`, `AUTH_SECRET`, and `BRIDGE_URL` values from `.env.example`).

## Development

```bash
make dev   # starts postgres, the bridge (mock mode), and the Next.js dev server
```

Open <http://localhost:3000/setup> to run the first-time wizard, or
<http://localhost:3000> to log in.

## Docker

```bash
make build   # build all images
make up      # start postgres, bridge, and web app
make down    # stop everything
```

## Make targets

| Command | Description |
|---------|-------------|
| `make setup` | First-time setup (postgres, deps, migrations) |
| `make dev` | Run postgres + bridge + web dev server |
| `make bridge` | Run only the C# bridge |
| `make build` / `make up` / `make down` | Build / start / stop Docker services |
| `make db-migrate` | Create a Prisma migration |
| `make db-studio` | Open Prisma Studio |
| `make lint` | Lint the web app |
| `make test` | Run web + bridge tests |
| `make backup` | Dump the database to `backups/` |
| `make restore FILE=backups/foo.sql.gz` | Restore a database dump |
| `make clean` | Remove build artifacts and `node_modules` |

## Configuration

Environment variables are documented in [`.env.example`](.env.example). All secrets stay
in `.env` (gitignored) and are never committed.
