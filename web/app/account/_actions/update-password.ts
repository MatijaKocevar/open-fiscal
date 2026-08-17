"use server"

import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { getActionTranslations } from "@/lib/i18n"

export async function updatePassword(formData: {
  currentPassword: string
  newPassword: string
}) {
  const t = await getActionTranslations("errors")
  const session = await auth()
  if (!session?.user) return { ok: false as const, error: t("noSession") }

  if (formData.newPassword.length < 6) {
    return { ok: false as const, error: t("passwordTooShort") }
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user) return { ok: false as const, error: t("userNotFound") }

  const valid = await bcrypt.compare(formData.currentPassword, user.passwordHash)
  if (!valid) return { ok: false as const, error: t("wrongCurrentPassword") }

  const passwordHash = await bcrypt.hash(formData.newPassword, 12)
  await db.user.update({ where: { id: user.id }, data: { passwordHash } })

  revalidatePath("/account")
  return { ok: true as const }
}
