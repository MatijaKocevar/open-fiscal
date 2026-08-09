import { Suspense } from "react"
import { getRecentInvoices } from "@/lib/queries/invoices"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

async function RecentInvoicesList() {
  const invoices = await getRecentInvoices(10)

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Ni računov. Ustvarite prvi račun na blagajni.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="border rounded-lg divide-y">
      {invoices.map((inv) => (
        <Link key={inv.id} href={`/invoices/${inv.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors">
          <div>
            <span className="font-medium">#{inv.invoiceNumber}</span>
            {inv.customer && <span className="ml-2 text-sm text-muted-foreground">{inv.customer.name}</span>}
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={inv.fiscalNumber ? "default" : "outline"}>
              {inv.fiscalNumber ? "Fiskaliziran" : "Brez EOR"}
            </Badge>
            <span className="font-medium tabular-nums">{Number(inv.totalGross).toFixed(2)} €</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nadzorna plošča</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/pos">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">🛒 Blagajna</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Nov račun, gotovina, kartica</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/invoices">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">🧾 Računi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Pregled vseh izdanih računov</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/reports">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">📈 Poročila</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">DDV, dnevni promet</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <h2 className="text-lg font-semibold">Zadnji računi</h2>
      <Suspense fallback={<Skeleton className="h-48 w-full" />}>
        <RecentInvoicesList />
      </Suspense>
    </div>
  )
}
