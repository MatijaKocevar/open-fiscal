import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SchedulePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Urnik</h1>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Urnik bo na voljo v naslednji različici.
        </CardContent>
      </Card>
    </div>
  )
}
