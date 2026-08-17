import { Suspense } from "react"
import { InvoiceTable } from "./_components/invoice-table"
import { InvoiceTableSkeleton } from "./_components/invoice-table-skeleton"

export const dynamic = "force-dynamic"

export default function InvoicesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Invoices</h1>
      <Suspense fallback={<InvoiceTableSkeleton />}>
        <InvoiceTable />
      </Suspense>
    </div>
  )
}
