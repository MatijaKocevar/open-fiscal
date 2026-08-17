import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"

type VatSummaryCardProps = {
  net: number
  vat: number
  gross: number
}

export function VatSummaryCard({ net, vat, gross }: VatSummaryCardProps) {
  const t = useTranslations("reports")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("monthlyVat")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm border-b pb-2">
            <span>{t("net")}</span>
            <span className="tabular-nums font-medium">{net.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t("vat")}</span>
            <span className="tabular-nums font-medium">{vat.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t pt-2">
            <span>{t("gross")}</span>
            <span className="tabular-nums">{gross.toFixed(2)} €</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
