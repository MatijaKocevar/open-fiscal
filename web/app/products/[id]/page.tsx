import { getProductById } from "@/lib/queries/products"
import { Card, CardContent } from "@/components/ui/card"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { ProductForm } from "./_components/product-form"

export const dynamic = "force-dynamic"

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) notFound()

  const t = await getTranslations("products")

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">{t("editProduct")}</h1>
      <Card>
        <CardContent className="pt-6">
          <ProductForm product={{ id: product.id, name: product.name, unitPrice: Number(product.unitPrice), vatRate: Number(product.vatRate), unit: product.unit, barcode: product.barcode ?? "" }} />
        </CardContent>
      </Card>
    </div>
  )
}
