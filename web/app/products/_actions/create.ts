"use server"

import { db } from "@/lib/db"
import { ProductCreateSchema } from "@/schemas/product"
import { revalidatePath } from "next/cache"
import { safeParseLocalized } from "@/lib/zod-i18n"

export async function createProduct(formData: unknown) {
  const parsed = await safeParseLocalized(ProductCreateSchema, "product", formData)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message }
  }

  await db.product.create({
    data: parsed.data,
  })

  revalidatePath("/products")
  return { ok: true as const }
}
