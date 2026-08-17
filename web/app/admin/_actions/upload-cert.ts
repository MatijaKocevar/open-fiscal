"use server"

import { writeFile } from "fs/promises"
import path from "path"
import { revalidatePath } from "next/cache"
import { getActionTranslations } from "@/lib/i18n"

export async function uploadCert(formData: FormData) {
  const t = await getActionTranslations("errors")
  const file = formData.get("cert") as File
  if (!file) return { ok: false as const, error: t("fileNotUploaded") }

  const buffer = Buffer.from(await file.arrayBuffer())
  const certPath = path.join(process.cwd(), "..", "certs", file.name)

  await writeFile(certPath, buffer)

  revalidatePath("/admin")
  return { ok: true as const }
}
