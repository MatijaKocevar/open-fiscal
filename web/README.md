# web

Next.js 16 App Router frontend for OpenFiscal: point-of-sale,
invoices, products, customers, schedule, reports, and admin.

## Prerequisites

- Node.js 20+
- PostgreSQL 16 (see root `docker-compose.dev.yml`)

## Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
```

Create `.env` (see root `.env.example`). Minimum required:

```env
DATABASE_URL=postgresql://openfiscal:openfiscal_secret@localhost:5432/openfiscal
AUTH_SECRET=<random string>
BRIDGE_URL=http://localhost:5100
```

## Run

```bash
npm run dev     # development server at http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

Open <http://localhost:3000/setup> for the first-time wizard (company, SMTP,
certificates, premise).

## Git workflow

Never commit directly to `main`. Create a feature branch and open a pull request:

```bash
git fetch origin
git checkout -b feat/<slug> origin/main   # or fix/, chore/, refactor/, docs/
git push -u origin feat/<slug>
gh pr create
```

## Structure

| Path | Description |
|------|-------------|
| `app/` | Routes; colocated `_actions/` (server actions) and `_components/` |
| `schemas/` | Global Zod schemas (types inferred via `z.infer`) |
| `lib/` | Shared utilities; `db.ts` is the only place `@prisma/client` is imported |
| `lib/queries/` | Shared data reads, one file per query + barrel `index.ts` |
| `stores/` | Zustand client state (`cart`, `ui`) |
| `components/ui/` | shadcn/ui primitives |
| `prisma/` | Prisma schema + migrations (client generated to `app/generated/prisma`) |

## Conventions

- `params` and `searchParams` are Promises — always `await` them.
- `"use server"` only in `app/*/_actions/*.ts`; `"use client"` only where needed.
- `@prisma/client` only in `lib/db.ts` and `lib/queries/*`.
- One action per file, one query per file, barrel `index.ts` re-exports.
- Prisma client is generated to `app/generated/prisma` (see `prisma.config.ts`).
