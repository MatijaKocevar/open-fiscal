// Load .env for local development (Prisma CLI doesn't auto-load it anymore).
// In production (Docker), env vars are injected by the container — don't mask them.
if (process.env.NODE_ENV !== "production") {
  try {
    process.loadEnvFile()
  } catch {
    // no .env file — rely on host/container env vars
  }
}

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"]!,
  },
});
