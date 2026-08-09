import { getAvailableProducts } from "@/lib/queries/products"
import { ProductCard } from "./product-card"

export async function ProductGrid() {
  const products = await getAvailableProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg">
        No products. Add products to catalog.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
