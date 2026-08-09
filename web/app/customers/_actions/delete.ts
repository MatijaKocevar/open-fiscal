"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function deleteCustomer(id: string) {
  await db.customer.delete({ where: { id } })
  revalidatePath("/customers")
  return { ok: true as const }
}
