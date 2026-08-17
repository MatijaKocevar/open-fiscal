"use server"

import { getActionTranslations } from "@/lib/i18n"

export async function restoreBackup(formData: FormData) {
  const t = await getActionTranslations("errors")
  const file = formData.get("backup") as File
  if (!file) return { ok: false as const, error: t("fileNotUploaded") }

  return { ok: false as const, error: t("restoreNotImplemented") }
}
