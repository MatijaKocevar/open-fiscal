import { db } from "@/lib/db"

export async function getAllDevices() {
  return db.device.findMany()
}
