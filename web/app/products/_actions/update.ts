"use server"

import { db } from "@/lib/db"
import { ProductUpdateSchema } from "@/schemas/product"
import { revalidatePath } from "next/cache"
import { safeParseLocalized } from "@/lib/zod-i18n"

export async function updateProduct(id: string, formData: unknown) {
  const parsed = await safeParseLocalized(ProductUpdateSchema, "product", formData)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message }
  }

  await db.product.update({
    where: { id },
    data: parsed.data,
  })

  revalidatePath("/products")
  revalidatePath(`/products/${id}`)
  return { ok: true as const }
}
