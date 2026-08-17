"use server"

import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function updatePassword(formData: {
  currentPassword: string
  newPassword: string
}) {
  const session = await auth()
  if (!session?.user) return { ok: false as const, error: "No session" }

  if (formData.newPassword.length < 6) {
    return { ok: false as const, error: "Password must be at least 6 characters" }
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user) return { ok: false as const, error: "User not found" }

  const valid = await bcrypt.compare(formData.currentPassword, user.passwordHash)
  if (!valid) return { ok: false as const, error: "Current password is incorrect" }

  const passwordHash = await bcrypt.hash(formData.newPassword, 12)
  await db.user.update({ where: { id: user.id }, data: { passwordHash } })

  revalidatePath("/account")
  return { ok: true as const }
}
