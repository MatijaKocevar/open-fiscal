import { db } from "@/lib/db"

export async function getCustomerById(id: string) {
  return db.customer.findUnique({
    where: { id },
    include: { invoices: { orderBy: { createdAt: "desc" }, take: 20 } },
  })
}
