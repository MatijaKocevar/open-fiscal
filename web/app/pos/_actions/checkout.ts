"use server"

import { db } from "@/lib/db"
import { InvoiceCreateSchema } from "@/schemas/invoice"
import { sendInvoiceToBridge } from "@/lib/bridge"
import { sumTotals } from "@/lib/vat"
import { revalidatePath } from "next/cache"

export async function checkout(formData: unknown) {
  const parsed = InvoiceCreateSchema.safeParse(formData)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || "Neveljavni podatki" }
  }

  const { paymentMethod, customerId, items } = parsed.data

  const totals = sumTotals(items.map(i => ({ net: i.totalNet, vat: i.totalVat, gross: i.totalNet + i.totalVat })))

  const company = await db.company.findFirst()
  const device = await db.device.findFirst({ where: { isActive: true } })
  const premise = await db.premise.findFirst({ where: { isActive: true } })

  if (!company || !device || !premise) {
    return { ok: false as const, error: "Podjetje ni v celoti nastavljeno. Obiščite nastavitve." }
  }

  const lastInvoice = await db.invoice.findFirst({ orderBy: { invoiceNumber: "desc" } })
  const invoiceNumber = (lastInvoice?.invoiceNumber ?? 0) + 1
  const now = new Date()

  try {
    const bridgeResult = await sendInvoiceToBridge({
      taxNumber: company.taxNumber || "",
      issueDateTime: now.toISOString(),
      invoiceNumber: invoiceNumber.toString(),
      premiseId: premise.premiseId,
      deviceId: device.deviceId,
      invoiceAmount: totals.totalGross,
      paymentMethod,
      items: items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        vatRate: i.vatRate,
        totalNet: i.totalNet,
        totalVat: i.totalVat,
      })),
    })

    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        fiscalNumber: bridgeResult.eor,
        zoi: bridgeResult.zoi,
        jir: bridgeResult.jir,
        qrCode: bridgeResult.qrCode,
        verifyUrl: bridgeResult.verifyUrl,
        totalNet: totals.totalNet,
        totalVat: totals.totalVat,
        totalGross: totals.totalGross,
        paymentMethod,
        issueDateTime: now,
        deviceId: device.deviceId,
        premiseId: premise.premiseId,
        createdBy: "system",
        customerId: customerId || null,
        items: {
          create: items.map(i => ({
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            vatRate: i.vatRate,
            totalNet: i.totalNet,
            totalVat: i.totalVat,
          })),
        },
      },
    })

    revalidatePath("/invoices")
    revalidatePath("/")

    return { ok: true as const, data: { invoiceId: invoice.id, invoiceNumber } }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Napaka pri fiskalizaciji"
    return { ok: false as const, error: msg }
  }
}
