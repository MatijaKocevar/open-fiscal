"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { getActionTranslations } from "@/lib/i18n"

export async function toggleUserActive(userId: string) {
  const t = await getActionTranslations("errors")
  const session = await auth()
  if (!session?.user || session.user.role !== "OWNER") {
    return { ok: false as const, error: t("noPermission") }
  }

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) return { ok: false as const, error: t("userNotFound") }

  await db.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  })

  revalidatePath("/admin/users")
  return { ok: true as const }
}
