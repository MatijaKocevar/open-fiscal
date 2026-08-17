import { Suspense } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { CustomerList } from "./_components/customer-list"
import { CustomerListSkeleton } from "./_components/customer-list-skeleton"

export const dynamic = "force-dynamic"

export default function CustomersPage() {
  const t = useTranslations("customers")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Link href="/customers/new" className="text-sm text-primary hover:underline">
          {t("addCustomer")}
        </Link>
      </div>
      <Suspense fallback={<CustomerListSkeleton />}>
        <CustomerList />
      </Suspense>
    </div>
  )
}
