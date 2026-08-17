import { Suspense } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductList } from "./_components/product-list"

export const dynamic = "force-dynamic"

export default function ProductsPage() {
  const t = useTranslations("products")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Link href="/products/new" className="text-sm text-primary hover:underline">
          {t("addProduct")}
        </Link>
      </div>
      <Suspense fallback={<Skeleton className="h-48 w-full" />}>
        <ProductList />
      </Suspense>
    </div>
  )
}
