import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAppointmentsByDate } from "@/lib/queries/appointments"

export const dynamic = "force-dynamic"

export default async function SchedulePage() {
  const now = new Date()
  const appointments = await getAppointmentsByDate(now)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Schedule — {now.toLocaleDateString("sl-SI", { weekday: "long", day: "numeric", month: "long" })}
      </h1>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No appointments today.
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
                    {new Date(a.date).toLocaleTimeString("sl-SI", { hour: "2-digit", minute: "2-digit" })} ({a.durationMin} min)
                  </div>
                  {a.notes && <div className="text-xs text-muted-foreground mt-1">{a.notes}</div>}
                </div>
                <Badge variant={a.isCancelled ? "destructive" : "default"}>
                  {a.isCancelled ? "Cancelled" : "Confirmed"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
