import { db } from "@/lib/db"

export async function getAppointmentsByEmployee(employeeId: string) {
  return db.appointment.findMany({
    where: { customerId: employeeId, isCancelled: false },
    orderBy: { date: "asc" },
  })
}
