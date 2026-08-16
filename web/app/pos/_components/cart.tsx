"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/stores/cart"
import { checkout } from "../_actions"
import { showError, showSuccess } from "@/lib/toast-error"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { calculateVat, sumVatBreakdown, sumTotals } from "@/lib/vat"

interface Props {
  customers: Array<{ id: string; name: string; vatId: string | null }>
}

export function PosCart({ customers }: Props) {
  const { items, customerId, customerVatId, removeItem, updateQuantity, clear, setCustomer, setCustomerVatId } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const lineItems = items.map((item) => {
    const { net, vat, gross } = calculateVat(item.unitPrice, item.quantity, item.vatRate)
    return { ...item, net, vat, gross }
  })

  const { totalNet, totalVat, totalGross } = sumTotals(lineItems)
  const vatBreakdown = sumVatBreakdown(lineItems.map(i => ({ ...i, rate: i.vatRate })))

  function handleCustomerChange(id: string | null) {
    if (!id || id === "none") {
      setCustomer({ id: null, vatId: "" })
      return
    }
    const c = customers.find((x) => x.id === id)
    setCustomer({ id: c?.id ?? null, vatId: c?.vatId ?? "" })
  }

  async function handleCheckout() {
    if (items.length === 0) return
    setLoading(true)
    const result = await checkout({
      paymentMethod: "CASH",
      customerId: customerId ?? undefined,
      customerVatId: customerVatId || undefined,
      items: items.map((item) => {
        const { net, vat } = calculateVat(item.unitPrice, item.quantity, item.vatRate)
        return {
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          vatRate: item.vatRate,
          totalNet: net,
          totalVat: vat,
        }
      }),
    })
    setLoading(false)

    if (result.ok) {
      showSuccess("Invoice fiscalized!")
      clear()
      router.push(`/invoices/${result.data.invoiceId}`)
    } else {
      showError(result.error)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Cart</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Cart is empty</p>
        ) : (
          <>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{item.name}</div>
                    <div className="text-muted-foreground">{item.unitPrice.toFixed(2)} €</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                      className="w-14 h-7 text-center text-xs"
                      min={0}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500"
                      onClick={() => removeItem(item.productId)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-2">
              <div className="space-y-1">
                <label className="text-xs font-medium">Customer</label>
                <Select value={customerId ?? "none"} onValueChange={handleCustomerChange}>
                  <SelectTrigger><SelectValue placeholder="Walk-in" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Walk-in</SelectItem>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Tax number (if requested)</label>
                <Input
                  value={customerVatId}
                  onChange={(e) => setCustomerVatId(e.target.value)}
                  placeholder="Optional — for B2B invoice"
                />
              </div>
            </div>

            <div className="border-t pt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Net</span>
                <span className="tabular-nums">{totalNet.toFixed(2)} €</span>
              </div>
              {vatBreakdown.map((v) => (
                <div key={v.rate} className="flex justify-between text-muted-foreground">
                  <span>VAT {v.rate}%</span>
                  <span className="tabular-nums">{v.vat.toFixed(2)} €</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-base pt-1 border-t">
                <span>TOTAL</span>
                <span className="tabular-nums">{totalGross.toFixed(2)} €</span>
              </div>
            </div>
            <Button className="w-full" onClick={handleCheckout} disabled={loading}>
              {loading ? "Fiscalizing..." : `Pay ${totalGross.toFixed(2)} €`}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
