import { db } from "@/lib/db"

export async function getAllCustomers() {
  return db.customer.findMany({
    orderBy: { name: "asc" },
  })
}
