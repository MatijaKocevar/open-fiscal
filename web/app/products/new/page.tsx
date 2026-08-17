import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { NewProductForm } from "./_components/new-product-form"

export default function NewProductPage() {
  const t = useTranslations("products")

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">{t("newProduct")}</h1>
      <Card>
        <CardContent className="pt-6">
          <NewProductForm />
        </CardContent>
      </Card>
    </div>
  )
}
