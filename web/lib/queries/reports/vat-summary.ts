import { db } from "@/lib/db"

export async function getVatSummary(from: Date, to: Date) {
  const invoices = await db.invoice.findMany({
    where: {
      issueDateTime: { gte: from, lte: to },
    },
    select: { totalNet: true, totalVat: true, totalGross: true },
  })
  return {
    totalNet: invoices.reduce((s, i) => s + Number(i.totalNet), 0),
    totalVat: invoices.reduce((s, i) => s + Number(i.totalVat), 0),
    totalGross: invoices.reduce((s, i) => s + Number(i.totalGross), 0),
    count: invoices.length,
  }
}
