"use server"

import { db } from "@/lib/db"
import { CustomerUpdateSchema } from "@/schemas/customer"
import { revalidatePath } from "next/cache"

export async function updateCustomer(id: string, formData: unknown) {
  const parsed = CustomerUpdateSchema.safeParse(formData)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || "Neveljavni podatki" }
  }

  await db.customer.update({
    where: { id },
    data: parsed.data,
  })

  revalidatePath("/customers")
  revalidatePath(`/customers/${id}`)
  return { ok: true as const }
}
