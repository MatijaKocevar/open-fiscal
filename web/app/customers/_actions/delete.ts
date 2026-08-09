"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function deleteCustomer(id: string) {
  try {
    await db.customer.delete({ where: { id } })
    revalidatePath("/customers")
    return { ok: true as const }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Delete error"
    return { ok: false as const, error: msg }
  }
}
