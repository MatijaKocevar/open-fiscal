import { Suspense } from "react"
import { getRecentInvoices } from "@/lib/queries/invoices"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

async function InvoiceTable() {
  const invoices = await getRecentInvoices(50)

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg">
        Ni računov.
      </div>
    )
  }

  return (
    <div className="border rounded-lg divide-y">
      {invoices.map((inv) => (
        <Link
          key={inv.id}
          href={`/invoices/${inv.id}`}
          className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
        >
          <div>
            <span className="font-medium">#{inv.invoiceNumber}</span>
            <span className="ml-3 text-sm text-muted-foreground">
              {inv.issueDateTime.toLocaleDateString("sl-SI", { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
            {inv.customer && <span className="ml-2 text-sm">{inv.customer.name}</span>}
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={inv.fiscalNumber ? "default" : "outline"}>
              {inv.fiscalNumber ? "EOR" : "Brez EOR"}
            </Badge>
            <span className="font-medium tabular-nums">{Number(inv.totalGross).toFixed(2)} €</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function InvoicesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Računi</h1>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <InvoiceTable />
      </Suspense>
    </div>
  )
}
