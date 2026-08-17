<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Git workflow
- Never commit directly to `main` — always work on a feature branch.
- Branch from `main`: `git fetch origin && git checkout -b <type>/<slug> origin/main`
- Branch naming: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `refactor/<slug>`, `docs/<slug>`
- Commit with conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, …)
- Push the branch and open a PR (`gh pr create`); do not merge to `main` locally.
- Only commit when the user asks.
