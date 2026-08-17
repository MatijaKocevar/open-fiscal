import { getAvailableProducts } from "@/lib/queries/products"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export async function ProductList() {
  const t = await getTranslations("products")
  const products = await getAvailableProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg">
        {t("noProducts")}
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
                <Badge variant="secondary">{t("vat", { rate: Number(product.vatRate) })}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {t("stock")} {Number(product.stockQty)} {product.unit}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
