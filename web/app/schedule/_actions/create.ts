"use server"

import { db } from "@/lib/db"
import { AppointmentCreateSchema } from "@/schemas/appointment"
import { revalidatePath } from "next/cache"
import { safeParseLocalized } from "@/lib/zod-i18n"

export async function createAppointment(formData: unknown) {
  const parsed = await safeParseLocalized(AppointmentCreateSchema, "appointment", formData)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message }
  }

  await db.appointment.create({
    data: parsed.data,
  })

  revalidatePath("/schedule")
  return { ok: true as const }
}
