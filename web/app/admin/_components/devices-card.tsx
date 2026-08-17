import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DevicesCardProps = {
  devices: Array<{
    id: string
    name: string
    deviceId: string
    premiseId: string
  }>
}

export function DevicesCard({ devices }: DevicesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Devices</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {devices.length === 0 ? (
          <p className="text-muted-foreground">No registered devices.</p>
        ) : (
          <ul className="space-y-1">
            {devices.map((d) => (
              <li key={d.id}>
                {d.name} ({d.deviceId}) - Premise: {d.premiseId}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
