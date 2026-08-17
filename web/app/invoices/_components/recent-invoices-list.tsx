import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { getRecentInvoices } from "@/lib/queries/invoices"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export async function RecentInvoicesList() {
  const t = await getTranslations("invoices")
  const invoices = await getRecentInvoices(10)

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {t("noInvoicesRecent")}
        </CardContent>
      </Card>
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
            {inv.customer && (
              <span className="ml-2 text-sm text-muted-foreground">
                {inv.customer.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={inv.fiscalNumber ? "default" : "outline"}>
              {inv.fiscalNumber ? t("fiscalized") : t("noEor")}
            </Badge>
            <span className="font-medium tabular-nums">
              {Number(inv.totalGross).toFixed(2)} €
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
