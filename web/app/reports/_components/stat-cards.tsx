import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type StatCardsProps = {
  todayGross: number
  todayVat: number
  todayCount: number
  monthGross: number
  monthVat: number
  monthCount: number
}

export function StatCards({
  todayGross,
  todayVat,
  todayCount,
  monthGross,
  monthVat,
  monthCount,
}: StatCardsProps) {
  const average = monthCount > 0 ? monthGross / monthCount : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{todayGross.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">
            VAT: {todayVat.toFixed(2)} € | Invoices: {todayCount}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">This month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{monthGross.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">
            VAT: {monthVat.toFixed(2)} € | Invoices: {monthCount}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Average invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{average.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>
    </div>
  )
}
