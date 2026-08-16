import { getInvoiceById } from "@/lib/queries/invoices"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ResendButton } from "./_components/invoice-detail"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = await getInvoiceById(id)

  if (!invoice) notFound()

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Details</span>
            <Badge variant="default">{invoice.paymentMethod}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground">Date:</span>{" "}
              {invoice.issueDateTime.toLocaleString("sl-SI")}
            </div>
            <div>
              <span className="text-muted-foreground">EOR:</span>{" "}
              <code className="text-xs">{invoice.fiscalNumber || "-"}</code>
            </div>
            <div>
              <span className="text-muted-foreground">ZOI:</span>{" "}
              <code className="text-xs">{invoice.zoi || "-"}</code>
            </div>
            <div>
              <span className="text-muted-foreground">JIR:</span>{" "}
              <code className="text-xs">{invoice.jir || "-"}</code>
            </div>
            {invoice.customer && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Customer:</span>{" "}
                {invoice.customer.name}
                {invoice.customer.vatId && ` (${invoice.customer.vatId})`}
              </div>
            )}
          </div>

          <div className="border-t pt-3">
            <h3 className="font-medium mb-2">Items</h3>
            <div className="space-y-1">
              {invoice.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {Number(item.quantity)}
                  </span>
                  <span className="tabular-nums">
                    {(Number(item.totalNet) + Number(item.totalVat)).toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Net</span>
              <span className="tabular-nums">{Number(invoice.totalNet).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>VAT</span>
              <span className="tabular-nums">{Number(invoice.totalVat).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>TOTAL</span>
              <span className="tabular-nums">{Number(invoice.totalGross).toFixed(2)} €</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <ResendButton invoiceId={invoice.id} />
    </div>
  )
}
