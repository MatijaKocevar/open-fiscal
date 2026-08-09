"use server"

import { db } from "@/lib/db"
import { AppointmentCreateSchema } from "@/schemas/appointment"
import { revalidatePath } from "next/cache"

export async function createAppointment(formData: unknown) {
  const parsed = AppointmentCreateSchema.safeParse(formData)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || "Invalid data" }
  }

  await db.appointment.create({
    data: parsed.data,
  })

  revalidatePath("/schedule")
  return { ok: true as const }
}
