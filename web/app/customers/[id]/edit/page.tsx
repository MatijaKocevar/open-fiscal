import { getCustomerById } from "@/lib/queries/customers"
import { Card, CardContent } from "@/components/ui/card"
import { notFound } from "next/navigation"
import { CustomerForm } from "../../_components/customer-form"

export const dynamic = "force-dynamic"

export default async function CustomerEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = await getCustomerById(id)

  if (!customer) notFound()

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">Uredi stranko</h1>
      <Card>
        <CardContent className="pt-6">
          <CustomerForm customer={{
            id: customer.id,
            name: customer.name,
            vatId: customer.vatId ?? "",
            address: customer.address ?? "",
            city: customer.city ?? "",
            postalCode: customer.postalCode ?? "",
            phone: customer.phone ?? "",
            email: customer.email ?? "",
          }} />
        </CardContent>
      </Card>
    </div>
  )
}
