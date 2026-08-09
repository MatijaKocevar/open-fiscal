"use server"

import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { SetupCompleteSchema } from "@/schemas/settings"

export async function completeSetup(formData: unknown) {
  const parsed = SetupCompleteSchema.safeParse(formData)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || "Invalid data" }
  }

  const data = parsed.data

  await db.company.create({
    data: {
      name: data.name,
      taxNumber: data.taxNumber,
      vatId: data.vatId,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      phone: data.phone,
      email: data.email,
      website: data.website,
      iban: data.iban,
    },
  })

  const settingsToSave = [
    { key: "smtp_host", value: data.smtp_host },
    { key: "smtp_port", value: data.smtp_port },
    { key: "smtp_user", value: data.smtp_user },
    { key: "smtp_pass", value: data.smtp_pass },
    { key: "smtp_from", value: data.smtp_from },
  ]

  for (const s of settingsToSave) {
    await db.settings.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }

  await db.premise.create({
    data: {
      premiseId: data.premiseId,
      name: data.premiseName,
      address: data.premiseAddress,
      city: data.premiseCity,
    },
  })

  await db.device.create({
    data: {
      deviceId: data.deviceId,
      name: data.deviceName,
      premiseId: data.premiseId,
    },
  })

  if (data.adminEmail && data.adminPassword) {
    const passwordHash = await bcrypt.hash(data.adminPassword, 12)
    await db.user.create({
      data: {
        email: data.adminEmail,
        passwordHash,
        name: "Admin",
        role: "OWNER",
      },
    })
  }

  redirect("/login")
}
