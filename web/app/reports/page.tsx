import { getVatSummary, getPaymentBreakdown } from "@/lib/queries/reports"
import { StatCards } from "./_components/stat-cards"
import { VatSummaryCard } from "./_components/vat-summary-card"
import { PaymentBreakdownCard } from "./_components/payment-breakdown-card"

export const dynamic = "force-dynamic"

export default async function ReportsPage() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [month, today, paymentBreakdown] = await Promise.all([
    getVatSummary(monthStart, now),
    getVatSummary(todayStart, now),
    getPaymentBreakdown(monthStart, now),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <StatCards
        todayGross={today.totalGross}
        todayVat={today.totalVat}
        todayCount={today.count}
        monthGross={month.totalGross}
        monthVat={month.totalVat}
        monthCount={month.count}
      />
      <VatSummaryCard net={month.totalNet} vat={month.totalVat} gross={month.totalGross} />
      <PaymentBreakdownCard breakdown={paymentBreakdown} />
    </div>
  )
}
