"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateProduct, deleteProduct } from "@/app/products/_actions"
import { showError, showSuccess } from "@/lib/toast-error"
import { useRouter } from "next/navigation"
import { useState } from "react"

const VAT_RATES = ["0", "5", "9.5", "22", "25"]

interface Props {
  product: { id: string; name: string; unitPrice: number; vatRate: number; unit: string; barcode: string }
}

export function ProductForm({ product }: Props) {
  const router = useRouter()
  const [name, setName] = useState(product.name)
  const [unitPrice, setUnitPrice] = useState(product.unitPrice.toString())
  const [vatRate, setVatRate] = useState(product.vatRate.toString())
  const [unit, setUnit] = useState(product.unit)
  const [barcode, setBarcode] = useState(product.barcode)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSave() {
    setLoading(true)
    const result = await updateProduct(product.id, {
      name,
      unitPrice: parseFloat(unitPrice) || 0,
      vatRate: parseFloat(vatRate) || 22,
      unit,
      barcode: barcode || undefined,
    })
    setLoading(false)
    if (!result.ok) {
      showError(result.error)
    } else {
      showSuccess("Product updated")
      router.push("/products")
    }
  }

  async function handleDelete() {
    if (!confirm("Delete product?")) return
    setDeleting(true)
    const result = await deleteProduct(product.id)
    setDeleting(false)
    if (result.ok) {
      showSuccess("Product deleted")
      router.push("/products")
    } else {
      showError(result.error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Price incl. VAT (€)</label>
          <Input type="number" step="0.01" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">VAT (%)</label>
          <Select value={vatRate} onValueChange={(v) => setVatRate(v ?? "22")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {VAT_RATES.map((r) => (
                <SelectItem key={r} value={r}>{r}%</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Unit</label>
          <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="pcs" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Barcode</label>
          <Input value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="5901234567890" />
        </div>
      </div>
      <div className="flex justify-between pt-2">
        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete"}
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  )
}
