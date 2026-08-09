"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function voidInvoice(id: string) {
  const invoice = await db.invoice.findUnique({ where: { id } })
  if (!invoice) return { ok: false as const, error: "Račun ne obstaja" }

  if (invoice.fiscalNumber) {
    return { ok: false as const, error: "Fiskaliziran račun ne more biti izbrisan" }
  }

  await db.invoice.delete({ where: { id } })
  revalidatePath("/invoices")
  return { ok: true as const }
}
