"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateSettings(settings: Record<string, string>) {
  for (const [key, value] of Object.entries(settings)) {
    await db.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }

  revalidatePath("/admin")
  return { ok: true as const }
}
