import { Suspense } from "react"
import { getAllCustomers } from "@/lib/queries/customers"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function CustomerList() {
  const customers = await getAllCustomers()

  if (customers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg">
        No customers. Add first customer.
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link href="/customers/new" className="text-sm text-primary hover:underline">
          + Add customer
        </Link>
      </div>
      <Suspense fallback={<Skeleton className="h-48 w-full" />}>
        <CustomerList />
      </Suspense>
    </div>
  )
}
