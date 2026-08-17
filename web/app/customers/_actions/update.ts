"use server"

import { db } from "@/lib/db"
import { CustomerUpdateSchema } from "@/schemas/customer"
import { revalidatePath } from "next/cache"
import { safeParseLocalized } from "@/lib/zod-i18n"

export async function updateCustomer(id: string, formData: unknown) {
  const parsed = await safeParseLocalized(CustomerUpdateSchema, "customer", formData)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message }
  }

  await db.customer.update({
    where: { id },
    data: parsed.data,
  })

  revalidatePath("/customers")
  revalidatePath(`/customers/${id}`)
  return { ok: true as const }
}
