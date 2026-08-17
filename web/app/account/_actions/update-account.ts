"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { getActionTranslations } from "@/lib/i18n"

export async function updateAccount(formData: { name: string; email: string }) {
  const t = await getActionTranslations("errors")
  const session = await auth()
  if (!session?.user) return { ok: false as const, error: t("noSession") }

  const name = formData.name.trim()
  const email = formData.email.trim().toLowerCase()

  if (!name) return { ok: false as const, error: t("nameRequired") }
  if (!email) return { ok: false as const, error: t("emailRequired") }

  try {
    const existing = await db.user.findUnique({ where: { email } })
    if (existing && existing.id !== session.user.id) {
      return { ok: false as const, error: t("emailInUse") }
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { name, email },
    })

    revalidatePath("/account")
    return { ok: true as const }
  } catch (error) {
    const msg = error instanceof Error ? error.message : t("updateError")
    return { ok: false as const, error: msg }
  }
}
