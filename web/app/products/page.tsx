import { Suspense } from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductList } from "./_components/product-list"

export const dynamic = "force-dynamic"

export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/products/new" className="text-sm text-primary hover:underline">
          + Add product
        </Link>
      </div>
      <Suspense fallback={<Skeleton className="h-48 w-full" />}>
        <ProductList />
      </Suspense>
    </div>
  )
}
