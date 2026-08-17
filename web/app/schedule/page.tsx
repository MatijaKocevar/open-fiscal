import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTranslations, getFormatter } from "next-intl/server"
import { getAppointmentsByDate } from "@/lib/queries/appointments"

export const dynamic = "force-dynamic"

export default async function SchedulePage() {
  const now = new Date()
  const appointments = await getAppointmentsByDate(now)
  const t = await getTranslations("schedule")
  const format = await getFormatter()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {t("title")} —{" "}
        {format.dateTime(now, { weekday: "long", day: "numeric", month: "long" })}
      </h1>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {t("noAppointments")}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {appointments.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{a.serviceName}</div>
                  <div className="text-sm text-muted-foreground">
                    {format.dateTime(new Date(a.date), { hour: "2-digit", minute: "2-digit" })}{" "}
                    ({a.durationMin} {t("min")})
                  </div>
                  {a.notes && <div className="text-xs text-muted-foreground mt-1">{a.notes}</div>}
                </div>
                <Badge variant={a.isCancelled ? "destructive" : "default"}>
                  {a.isCancelled ? t("cancelled") : t("confirmed")}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
