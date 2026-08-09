"use server"

import { db } from "@/lib/db"
import { ProductCreateSchema } from "@/schemas/product"
import { revalidatePath } from "next/cache"

export async function createProduct(formData: unknown) {
  const parsed = ProductCreateSchema.safeParse(formData)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || "Neveljavni podatki" }
  }

  await db.product.create({
    data: parsed.data,
  })

  revalidatePath("/products")
  return { ok: true as const }
}
