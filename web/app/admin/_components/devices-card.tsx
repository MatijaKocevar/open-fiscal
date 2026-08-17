import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"

type DevicesCardProps = {
  devices: Array<{
    id: string
    name: string
    deviceId: string
    premiseId: string
  }>
}

export function DevicesCard({ devices }: DevicesCardProps) {
  const t = useTranslations("settings")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("devices")}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {devices.length === 0 ? (
          <p className="text-muted-foreground">{t("noDevices")}</p>
        ) : (
          <ul className="space-y-1">
            {devices.map((d) => (
              <li key={d.id}>
                {d.name} ({d.deviceId}) - {t("premise")} {d.premiseId}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
