import { db } from "@/lib/db"

export async function getDailySales(from: Date, to: Date) {
  const invoices = await db.invoice.findMany({
    where: {
      issueDateTime: { gte: from, lte: to },
    },
    select: {
      issueDateTime: true,
      totalGross: true,
      totalVat: true,
      paymentMethod: true,
    },
    orderBy: { issueDateTime: "asc" },
  })

  const byDate = new Map<string, { gross: number; vat: number; count: number }>()
  for (const inv of invoices) {
    const day = inv.issueDateTime.toISOString().slice(0, 10)
    const existing = byDate.get(day) || { gross: 0, vat: 0, count: 0 }
    byDate.set(day, {
      gross: existing.gross + Number(inv.totalGross),
      vat: existing.vat + Number(inv.totalVat),
      count: existing.count + 1,
    })
  }

  return Array.from(byDate.entries()).map(([date, data]) => ({
    date,
    gross: Math.round(data.gross * 100) / 100,
    vat: Math.round(data.vat * 100) / 100,
    count: data.count,
  }))
}
