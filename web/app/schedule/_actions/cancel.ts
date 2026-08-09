"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function cancelAppointment(id: string) {
  await db.appointment.update({
    where: { id },
    data: { isCancelled: true },
  })

  revalidatePath("/schedule")
  return { ok: true as const }
}
