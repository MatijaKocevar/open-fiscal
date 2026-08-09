"use server"

export async function restoreBackup(formData: FormData) {
  const file = formData.get("backup") as File
  if (!file) return { ok: false as const, error: "File was not uploaded" }

  return { ok: false as const, error: "Restore not implemented. Use restore.sh on the server." }
}
