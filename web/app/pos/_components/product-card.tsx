"use client"

import { Card } from "@/components/ui/card"
import { useCart } from "@/stores/cart"

export function ProductCard({ product }: { product: { id: string; name: string; unitPrice: number; vatRate: number } }) {
  const addItem = useCart((s) => s.addItem)

  return (
    <Card
      className="p-3 cursor-pointer hover:bg-accent/50 transition-colors active:scale-95"
      onClick={() => addItem({ id: product.id, name: product.name, unitPrice: product.unitPrice, vatRate: product.vatRate })}
    >
      <div className="font-medium text-sm truncate">{product.name}</div>
      <div className="text-lg font-bold tabular-nums mt-1">{product.unitPrice.toFixed(2)} €</div>
    </Card>
  )
}
