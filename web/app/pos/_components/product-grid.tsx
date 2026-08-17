import { getTranslations } from "next-intl/server"
import { getAvailableProducts } from "@/lib/queries/products"
import { ProductCard } from "./product-card"

export async function ProductGrid() {
  const t = await getTranslations("products")
  const products = await getAvailableProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg">
        {t("noProductsCatalog")}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            id: product.id,
            name: product.name,
            unitPrice: Number(product.unitPrice),
            vatRate: Number(product.vatRate),
          }}
        />
      ))}
    </div>
  )
}
