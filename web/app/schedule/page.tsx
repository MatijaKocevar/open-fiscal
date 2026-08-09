import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function SchedulePage() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

  const appointments = await db.appointment.findMany({
    where: {
      date: { gte: todayStart, lte: todayEnd },
      isCancelled: false,
    },
    orderBy: { date: "asc" },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Urnik — {now.toLocaleDateString("sl-SI", { weekday: "long", day: "numeric", month: "long" })}</h1>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Danes ni terminov.
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
                  {a.isCancelled ? "Preklican" : "Potrjen"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
