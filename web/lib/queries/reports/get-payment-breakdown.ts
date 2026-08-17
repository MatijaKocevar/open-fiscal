import { db } from "@/lib/db"

export async function getPaymentBreakdown(from: Date, to: Date) {
  const invoices = await db.invoice.findMany({
    where: { issueDateTime: { gte: from, lte: to } },
    select: { totalGross: true, paymentMethod: true },
  })

  const breakdown: Record<string, number> = {}
  for (const invoice of invoices) {
    breakdown[invoice.paymentMethod] =
      (breakdown[invoice.paymentMethod] || 0) + Number(invoice.totalGross)
  }
  return breakdown
}
