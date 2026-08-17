import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PaymentBreakdownCardProps = {
  breakdown: Record<string, number>
}

export function PaymentBreakdownCard({ breakdown }: PaymentBreakdownCardProps) {
  const entries = Object.entries(breakdown)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment methods (this month)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map(([method, amount]) => (
            <div key={method} className="flex justify-between text-sm">
              <span>{method}</span>
              <span className="tabular-nums">{amount.toFixed(2)} €</span>
            </div>
          ))}
          {entries.length === 0 && (
            <p className="text-muted-foreground text-sm">No data</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
