import { db } from "@/lib/db"

export async function getSettings() {
  const settings = await db.settings.findMany()
  return Object.fromEntries(settings.map(s => [s.key, s.value]))
}

export async function getSetting(key: string) {
  const setting = await db.settings.findUnique({ where: { key } })
  return setting?.value ?? null
}
