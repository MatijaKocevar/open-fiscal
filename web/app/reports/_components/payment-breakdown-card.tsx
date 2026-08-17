import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"

type PaymentBreakdownCardProps = {
  breakdown: Record<string, number>
}

export function PaymentBreakdownCard({ breakdown }: PaymentBreakdownCardProps) {
  const t = useTranslations("reports")
  const tp = useTranslations("paymentMethods")
  const entries = Object.entries(breakdown)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("paymentMethods")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map(([method, amount]) => (
            <div key={method} className="flex justify-between text-sm">
              <span>{tp.has(method) ? tp(method) : method}</span>
              <span className="tabular-nums">{amount.toFixed(2)} €</span>
            </div>
          ))}
          {entries.length === 0 && (
            <p className="text-muted-foreground text-sm">{t("noData")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
