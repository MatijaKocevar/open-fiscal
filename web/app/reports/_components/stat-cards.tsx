import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"

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
  const t = useTranslations("reports")
  const average = monthCount > 0 ? monthGross / monthCount : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">{t("today")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{todayGross.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">
            {t("vatAndInvoices", { vat: todayVat.toFixed(2), count: todayCount })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">{t("thisMonth")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{monthGross.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">
            {t("vatAndInvoices", { vat: monthVat.toFixed(2), count: monthCount })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">{t("averageInvoice")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">{average.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">{t("thisMonth")}</p>
        </CardContent>
      </Card>
    </div>
  )
}
