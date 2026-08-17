# AGENTS.md — OpenFiscal

## Quick start
```bash
make setup-dev        # first time: docker, npm install, dotnet restore, prisma migrate
make dev              # start all services
```

## Project layout
```
company_app/
├── furs-bridge/       C# .NET 8 Minimal API — FURS fiscalization
├── web/               Next.js 16 App Router — UI + business logic
├── certs/             TLS certificates (gitignored, mounted to bridge)
├── docs/              FURS technical spec PDF
└── scripts/           backup, restore, setup
```

## Key conventions
- `params` and `searchParams` are Promises — always `await`
- `middleware.ts` → `proxy.ts` (Next.js 16)
- `@prisma/client` imports ONLY in `lib/db.ts` and `lib/queries/*`
- `"use server"` ONLY in `app/*/_actions/*.ts`
- One action per file, one query per file, barrel `index.ts` re-exports
- Schemas are global → `schemas/`
- Components colocated → `app/<route>/_components/`

## Git workflow
- Never commit directly to `main` — always work on a feature branch.
- Branch from `main`: `git fetch origin && git checkout -b <type>/<slug> origin/main`
- Branch naming: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `refactor/<slug>`, `docs/<slug>`
- Commit with conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, …)
- Push the branch and open a PR (`gh pr create`); do not merge to `main` locally.
- Only commit when the user asks.

## Commands
```bash
# Dev
make dev              # postgres + next dev
make bridge           # dotnet run bridge

# Build
npm run build         # Next.js production build
dotnet build          # C# bridge

# DB
npx prisma studio     # DB GUI
npx prisma migrate dev # create migration

# Docker
docker compose build
docker compose up -d
```
