import { Suspense } from "react"
import { getAvailableProducts } from "@/lib/queries/products"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

async function ProductList() {
  const products = await getAvailableProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg">
        Ni izdelkov. Dodajte prvi izdelek.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <Card className="hover:bg-accent/50 transition-colors h-full">
            <CardContent className="p-4">
              <div className="font-medium">{product.name}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold tabular-nums">
                  {Number(product.unitPrice).toFixed(2)} €
                </span>
                <Badge variant="secondary">DDV {Number(product.vatRate)}%</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Zaloga: {Number(product.stockQty)} {product.unit}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Izdelki</h1>
        <Link href="/products/new" className="text-sm text-primary hover:underline">
          + Dodaj izdelek
        </Link>
      </div>
      <Suspense fallback={<Skeleton className="h-48 w-full" />}>
        <ProductList />
      </Suspense>
    </div>
  )
}
