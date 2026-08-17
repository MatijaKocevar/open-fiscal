"use server"

import { db } from "@/lib/db"
import { CustomerCreateSchema } from "@/schemas/customer"
import { revalidatePath } from "next/cache"
import { safeParseLocalized } from "@/lib/zod-i18n"

export async function createCustomer(formData: unknown) {
  const parsed = await safeParseLocalized(CustomerCreateSchema, "customer", formData)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message }
  }

  await db.customer.create({
    data: parsed.data,
  })

  revalidatePath("/customers")
  return { ok: true as const }
}
