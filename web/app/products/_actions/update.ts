"use server"

import { db } from "@/lib/db"
import { ProductUpdateSchema } from "@/schemas/product"
import { revalidatePath } from "next/cache"

export async function updateProduct(id: string, formData: unknown) {
  const parsed = ProductUpdateSchema.safeParse(formData)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || "Neveljavni podatki" }
  }

  await db.product.update({
    where: { id },
    data: parsed.data,
  })

  revalidatePath("/products")
  revalidatePath(`/products/${id}`)
  return { ok: true as const }
}
