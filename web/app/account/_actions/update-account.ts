"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function updateAccount(formData: { name: string; email: string }) {
  const session = await auth()
  if (!session?.user) return { ok: false as const, error: "No session" }

  const name = formData.name.trim()
  const email = formData.email.trim().toLowerCase()

  if (!name) return { ok: false as const, error: "Name is required" }
  if (!email) return { ok: false as const, error: "Email is required" }

  try {
    const existing = await db.user.findUnique({ where: { email } })
    if (existing && existing.id !== session.user.id) {
      return { ok: false as const, error: "Email already in use" }
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { name, email },
    })

    revalidatePath("/account")
    return { ok: true as const }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Update error"
    return { ok: false as const, error: msg }
  }
}
