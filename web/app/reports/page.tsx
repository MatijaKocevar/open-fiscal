import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function ReportsPage() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [monthInvoices, todayInvoices] = await Promise.all([
    db.invoice.findMany({
      where: { issueDateTime: { gte: monthStart } },
      select: { totalNet: true, totalVat: true, totalGross: true, paymentMethod: true },
    }),
    db.invoice.findMany({
      where: {
        issueDateTime: {
          gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        },
      },
      select: { totalNet: true, totalVat: true, totalGross: true },
    }),
  ])

  const monthNet = monthInvoices.reduce((s, i) => s + Number(i.totalNet), 0)
  const monthVat = monthInvoices.reduce((s, i) => s + Number(i.totalVat), 0)
  const monthGross = monthInvoices.reduce((s, i) => s + Number(i.totalGross), 0)

  const todayNet = todayInvoices.reduce((s, i) => s + Number(i.totalNet), 0)
  const todayVat = todayInvoices.reduce((s, i) => s + Number(i.totalVat), 0)
  const todayGross = todayInvoices.reduce((s, i) => s + Number(i.totalGross), 0)

  const paymentBreakdown = monthInvoices.reduce((acc, i) => {
    acc[i.paymentMethod] = (acc[i.paymentMethod] || 0) + Number(i.totalGross)
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">{todayGross.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground">VAT: {todayVat.toFixed(2)} € | Invoices: {todayInvoices.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">This month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">{monthGross.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground">VAT: {monthVat.toFixed(2)} € | Invoices: {monthInvoices.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Average invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {monthInvoices.length > 0 ? (monthGross / monthInvoices.length).toFixed(2) : "0.00"} €
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly VAT</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm border-b pb-2">
              <span>Net</span>
              <span className="tabular-nums font-medium">{monthNet.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>VAT</span>
              <span className="tabular-nums font-medium">{monthVat.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t pt-2">
              <span>Gross</span>
              <span className="tabular-nums">{monthGross.toFixed(2)} €</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment methods (this month)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(paymentBreakdown).map(([method, amount]) => (
              <div key={method} className="flex justify-between text-sm">
                <span>{method}</span>
                <span className="tabular-nums">{amount.toFixed(2)} €</span>
              </div>
            ))}
            {Object.keys(paymentBreakdown).length === 0 && (
              <p className="text-muted-foreground text-sm">No data</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
