"use server"

import { db } from "@/lib/db"

export async function getVatSummaryAction(from: string, to: string) {
  const fromDate = new Date(from)
  const toDate = new Date(to)

  const invoices = await db.invoice.findMany({
    where: {
      issueDateTime: { gte: fromDate, lte: toDate },
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
