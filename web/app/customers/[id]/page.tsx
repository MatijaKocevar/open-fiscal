import { getCustomerById } from "@/lib/queries/customers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = await getCustomerById(id)

  if (!customer) notFound()

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">{customer.name}</h1>
      <Card>
        <CardContent className="py-4 space-y-2 text-sm">
          {customer.vatId && <p>Davčna: {customer.vatId}</p>}
          {customer.address && <p>Naslov: {customer.address}</p>}
          {customer.city && <p>Mesto: {customer.postalCode} {customer.city}</p>}
          {customer.phone && <p>Telefon: {customer.phone}</p>}
          {customer.email && <p>Email: {customer.email}</p>}
        </CardContent>
      </Card>
      {customer.invoices.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Računi</h2>
          <div className="border rounded-lg divide-y">
            {customer.invoices.map((inv) => (
              <Link
                key={inv.id}
                href={`/invoices/${inv.id}`}
                className="flex justify-between px-4 py-2 hover:bg-muted/50"
              >
                <span>#{inv.invoiceNumber}</span>
                <span className="tabular-nums">{Number(inv.totalGross).toFixed(2)} €</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
