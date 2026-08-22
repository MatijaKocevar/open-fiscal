"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { createProduct } from "@/app/products/_actions"
import { showError, showSuccess } from "@/lib/toast-error"

const VAT_RATES = ["0", "5", "9.5", "22", "25"]

export function NewProductDialog() {
  const t = useTranslations("products")
  const tc = useTranslations("common")
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [unitPrice, setUnitPrice] = useState("")
  const [vatRate, setVatRate] = useState("22")
  const [unit, setUnit] = useState("pcs")
  const [barcode, setBarcode] = useState("")
  const [loading, setLoading] = useState(false)

  function reset() {
    setName("")
    setUnitPrice("")
    setVatRate("22")
    setUnit("pcs")
    setBarcode("")
  }

  async function handleSave() {
    setLoading(true)
    const result = await createProduct({
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
      showSuccess(t("productCreated"))
      reset()
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus />
            {t("addProduct")}
          </Button>
        }
      />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("newProduct")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("newProduct")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("titleLabel")}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Espresso" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("priceInclVat")}</label>
              <Input type="number" step="0.01" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="2.50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("vatPct")}</label>
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
              <label className="text-sm font-medium">{t("unit")}</label>
              <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="pcs" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("barcode")}</label>
              <Input value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="5901234567890" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            {tc("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? tc("saving") : tc("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
