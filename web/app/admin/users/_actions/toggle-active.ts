"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function toggleUserActive(userId: string) {
  const session = await auth()
  if (!session?.user || session.user.role !== "OWNER") {
    return { ok: false as const, error: "No permission" }
  }

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) return { ok: false as const, error: "User not found" }

  await db.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  })

  revalidatePath("/admin/users")
  return { ok: true as const }
}
