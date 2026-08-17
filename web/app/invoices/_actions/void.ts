"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getActionTranslations } from "@/lib/i18n"

export async function voidInvoice(id: string) {
  const t = await getActionTranslations("errors")
  const invoice = await db.invoice.findUnique({ where: { id } })
  if (!invoice) return { ok: false as const, error: t("invoiceNotFound") }

  if (invoice.fiscalNumber) {
    return { ok: false as const, error: t("fiscalizedCannotDelete") }
  }

  await db.invoice.delete({ where: { id } })
  revalidatePath("/invoices")
  return { ok: true as const }
}
