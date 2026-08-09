import { db } from "@/lib/db"

export async function getInvoiceById(id: string) {
  return db.invoice.findUnique({
    where: { id },
    include: { items: true, customer: true },
  })
}
