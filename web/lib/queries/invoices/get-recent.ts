import { db } from "@/lib/db"

export async function getRecentInvoices(limit = 50) {
  return db.invoice.findMany({
    include: { customer: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}
