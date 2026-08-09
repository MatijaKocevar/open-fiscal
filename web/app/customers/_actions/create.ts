"use server"

import { db } from "@/lib/db"
import { CustomerCreateSchema } from "@/schemas/customer"
import { revalidatePath } from "next/cache"

export async function createCustomer(formData: unknown) {
  const parsed = CustomerCreateSchema.safeParse(formData)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || "Neveljavni podatki" }
  }

  await db.customer.create({
    data: parsed.data,
  })

  revalidatePath("/customers")
  return { ok: true as const }
}
