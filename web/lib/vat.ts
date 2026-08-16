export function calculateVat(pricePerUnit: number, quantity: number, vatRatePercent: number) {
  const taxRate = vatRatePercent / 100
  const totalGross = Math.round(pricePerUnit * quantity * 100) / 100
  const totalNet = Math.round((totalGross / (1 + taxRate)) * 100) / 100
  const totalVat = Math.round((totalGross - totalNet) * 100) / 100
  return {
    net: totalNet,
    vat: totalVat,
    gross: totalGross,
    rate: vatRatePercent
  }
}

export function sumVatBreakdown(items: Array<{ net: number; vat: number; gross: number; rate: number }>) {
  const breakdown = new Map<number, { net: number; vat: number; gross: number }>()
  for (const item of items) {
    const existing = breakdown.get(item.rate) || { net: 0, vat: 0, gross: 0 }
    breakdown.set(item.rate, {
      net: Math.round((existing.net + item.net) * 100) / 100,
      vat: Math.round((existing.vat + item.vat) * 100) / 100,
      gross: Math.round((existing.gross + item.gross) * 100) / 100
    })
  }
  return Array.from(breakdown.entries()).map(([rate, values]) => ({
    rate,
    net: values.net,
    vat: values.vat,
    gross: values.gross
  }))
}

export function sumTotals(items: Array<{ net: number; vat: number; gross: number }>) {
  return {
    totalNet: Math.round(items.reduce((s, i) => s + i.net, 0) * 100) / 100,
    totalVat: Math.round(items.reduce((s, i) => s + i.vat, 0) * 100) / 100,
    totalGross: Math.round(items.reduce((s, i) => s + i.gross, 0) * 100) / 100,
  }
}
