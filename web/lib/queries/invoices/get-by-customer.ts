import { db } from "@/lib/db"

export async function getInvoicesByCustomer(customerId: string) {
  return db.invoice.findMany({
    where: { customerId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })
}
