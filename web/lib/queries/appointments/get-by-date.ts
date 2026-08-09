import { db } from "@/lib/db"

export async function getAppointmentsByDate(date: Date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  return db.appointment.findMany({
    where: {
      date: { gte: start, lte: end },
      isCancelled: false,
    },
    orderBy: { date: "asc" },
  })
}
