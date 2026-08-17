import { Suspense } from "react"
import Link from "next/link"
import { CustomerList } from "./_components/customer-list"
import { CustomerListSkeleton } from "./_components/customer-list-skeleton"

export const dynamic = "force-dynamic"

export default function CustomersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link href="/customers/new" className="text-sm text-primary hover:underline">
          + Add customer
        </Link>
      </div>
      <Suspense fallback={<CustomerListSkeleton />}>
        <CustomerList />
      </Suspense>
    </div>
  )
}
