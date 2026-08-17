import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type VatSummaryCardProps = {
  net: number
  vat: number
  gross: number
}

export function VatSummaryCard({ net, vat, gross }: VatSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Monthly VAT</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm border-b pb-2">
            <span>Net</span>
            <span className="tabular-nums font-medium">{net.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>VAT</span>
            <span className="tabular-nums font-medium">{vat.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t pt-2">
            <span>Gross</span>
            <span className="tabular-nums">{gross.toFixed(2)} €</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
