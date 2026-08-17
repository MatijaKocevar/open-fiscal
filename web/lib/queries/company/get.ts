import { db } from "@/lib/db"

export async function getCompany() {
  return db.company.findFirst()
}
