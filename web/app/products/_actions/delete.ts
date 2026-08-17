"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getActionTranslations } from "@/lib/i18n"

export async function deleteProduct(id: string) {
  const t = await getActionTranslations("errors")
  try {
    await db.product.delete({ where: { id } })
    revalidatePath("/products")
    return { ok: true as const }
  } catch (error) {
    const msg = error instanceof Error ? error.message : t("deleteError")
    return { ok: false as const, error: msg }
  }
}
