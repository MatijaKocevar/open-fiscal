"use server"

export async function restoreBackup(formData: FormData) {
  const file = formData.get("backup") as File
  if (!file) return { ok: false as const, error: "Datoteka ni bila naložena" }

  return { ok: false as const, error: "Obnova ni implementirana. Uporabite restore.sh na strežniku." }
}
