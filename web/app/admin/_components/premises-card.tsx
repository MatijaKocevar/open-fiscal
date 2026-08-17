import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"

type PremisesCardProps = {
  premises: Array<{
    id: string
    name: string
    premiseId: string
    isActive: boolean
  }>
}

export function PremisesCard({ premises }: PremisesCardProps) {
  const t = useTranslations("settings")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("premises")}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {premises.length === 0 ? (
          <p className="text-muted-foreground">{t("noPremises")}</p>
        ) : (
          <ul className="space-y-1">
            {premises.map((p) => (
              <li key={p.id}>
                {p.name} ({p.premiseId}) - {p.isActive ? t("active") : t("closed")}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
