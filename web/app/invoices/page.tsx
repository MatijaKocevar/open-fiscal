import { Suspense } from "react"
import { useTranslations } from "next-intl"
import { InvoiceTable } from "./_components/invoice-table"
import { InvoiceTableSkeleton } from "./_components/invoice-table-skeleton"

export const dynamic = "force-dynamic"

export default function InvoicesPage() {
  const t = useTranslations("invoices")

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Suspense fallback={<InvoiceTableSkeleton />}>
        <InvoiceTable />
      </Suspense>
    </div>
  )
}
