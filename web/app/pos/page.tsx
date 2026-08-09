import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductGrid } from "./_components/product-grid"
import { ProductGridSkeleton } from "./_components/product-grid-skeleton"
import { PosCart } from "./_components/cart"

export const dynamic = "force-dynamic"

export default function PosPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Blagajna</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid />
          </Suspense>
        </div>
        <div>
          <PosCart />
        </div>
      </div>
    </div>
  )
}
