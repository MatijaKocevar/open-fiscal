import { Suspense } from "react"
import { getAllCustomers } from "@/lib/queries/customers"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

async function CustomerList() {
  const customers = await getAllCustomers()

  if (customers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg">
        Ni strank. Dodajte prvo stranko.
      </div>
    )
  }

  return (
    <div className="border rounded-lg divide-y">
      {customers.map((customer) => (
        <Link
          key={customer.id}
          href={`/customers/${customer.id}`}
          className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
        >
          <div>
            <span className="font-medium">{customer.name}</span>
            {customer.vatId && (
              <span className="ml-2 text-sm text-muted-foreground">{customer.vatId}</span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {customer.city || ""}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function CustomersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Stranke</h1>
      <Suspense fallback={<Skeleton className="h-48 w-full" />}>
        <CustomerList />
      </Suspense>
    </div>
  )
}
