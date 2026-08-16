import { Card, CardContent } from "@/components/ui/card"
import { NewCustomerForm } from "./_components/new-customer-form"

export default function NewCustomerPage() {
  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">New customer</h1>
      <Card>
        <CardContent className="pt-6">
          <NewCustomerForm />
        </CardContent>
      </Card>
    </div>
  )
}
