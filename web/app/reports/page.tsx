import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Poročila</h1>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Poročila bodo na voljo v naslednji različici.
        </CardContent>
      </Card>
    </div>
  )
}
