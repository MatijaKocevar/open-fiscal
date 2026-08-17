import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { NewCustomerForm } from "./_components/new-customer-form"

export default function NewCustomerPage() {
  const t = useTranslations("customers")

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">{t("newCustomer")}</h1>
      <Card>
        <CardContent className="pt-6">
          <NewCustomerForm />
        </CardContent>
      </Card>
    </div>
  )
}
