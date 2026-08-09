"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({ where: { id } })
    revalidatePath("/products")
    return { ok: true as const }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Napaka pri brisanju"
    return { ok: false as const, error: msg }
  }
}
