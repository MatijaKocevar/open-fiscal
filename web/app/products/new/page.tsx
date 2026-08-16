import { Card, CardContent } from "@/components/ui/card"
import { NewProductForm } from "./_components/new-product-form"

export default function NewProductPage() {
  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">New product</h1>
      <Card>
        <CardContent className="pt-6">
          <NewProductForm />
        </CardContent>
      </Card>
    </div>
  )
}
