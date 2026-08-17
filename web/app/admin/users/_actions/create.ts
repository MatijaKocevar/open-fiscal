"use server"

import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { getActionTranslations } from "@/lib/i18n"

export async function createUser(formData: {
  email: string
  password: string
  name: string
  role: string
}) {
  const t = await getActionTranslations("errors")
  const session = await auth()
  if (!session?.user || session.user.role !== "OWNER") {
    return { ok: false as const, error: t("noPermission") }
  }

  try {
    const existing = await db.user.findUnique({ where: { email: formData.email } })
    if (existing) return { ok: false as const, error: t("userExists") }

    const passwordHash = await bcrypt.hash(formData.password, 12)
    await db.user.create({
      data: {
        email: formData.email,
        passwordHash,
        name: formData.name,
        role: formData.role,
      },
    })

    revalidatePath("/admin/users")
    return { ok: true as const }
  } catch (error) {
    const msg = error instanceof Error ? error.message : t("createError")
    return { ok: false as const, error: msg }
  }
}
