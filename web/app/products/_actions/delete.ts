"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function deleteProduct(id: string) {
  await db.product.delete({ where: { id } })
  revalidatePath("/products")
  return { ok: true as const }
}
