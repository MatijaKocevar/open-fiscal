"use server"

import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createUser(formData: {
  email: string
  password: string
  name: string
  role: string
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "OWNER") {
    return { ok: false as const, error: "No permission" }
  }

  try {
    const existing = await db.user.findUnique({ where: { email: formData.email } })
    if (existing) return { ok: false as const, error: "User already exists" }

    const passwordHash = await bcrypt.hash(formData.password, 12)
    await db.user.create({
      data: {
        email: formData.email,
        passwordHash,
        name: formData.name,
        role: formData.role,
      },
    })

    revalidatePath("/admin")
    return { ok: true as const }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Create error"
    return { ok: false as const, error: msg }
  }
}

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

  revalidatePath("/admin")
  return { ok: true as const }
}
