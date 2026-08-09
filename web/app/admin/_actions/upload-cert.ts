"use server"

import { writeFile } from "fs/promises"
import path from "path"
import { revalidatePath } from "next/cache"

export async function uploadCert(formData: FormData) {
  const file = formData.get("cert") as File
  if (!file) return { ok: false as const, error: "Datoteka ni bila naložena" }

  const buffer = Buffer.from(await file.arrayBuffer())
  const certPath = path.join(process.cwd(), "..", "certs", file.name)

  await writeFile(certPath, buffer)

  revalidatePath("/admin")
  return { ok: true as const }
}
