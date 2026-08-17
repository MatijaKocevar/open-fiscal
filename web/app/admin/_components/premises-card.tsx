import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PremisesCardProps = {
  premises: Array<{
    id: string
    name: string
    premiseId: string
    isActive: boolean
  }>
}

export function PremisesCard({ premises }: PremisesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Business premises</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {premises.length === 0 ? (
          <p className="text-muted-foreground">No registered premises.</p>
        ) : (
          <ul className="space-y-1">
            {premises.map((p) => (
              <li key={p.id}>
                {p.name} ({p.premiseId}) - {p.isActive ? "Active" : "Closed"}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
