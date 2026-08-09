"use server"

import { db } from "@/lib/db"
import { generateReceiptPdf } from "@/lib/pdf"
import { sendReceipt } from "@/lib/smtp"

export async function resendReceipt(invoiceId: string, email: string) {
  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: true, customer: true },
  })

  if (!invoice) return { ok: false as const, error: "Invoice not found" }

  const company = await db.company.findFirst()
  if (!company) return { ok: false as const, error: "Company not set up" }

  try {
    const pdf = await generateReceiptPdf({
      companyName: company.name,
      companyAddress: company.address,
      companyCity: company.city,
      companyTaxNumber: company.taxNumber || "",
      invoiceNumber: invoice.invoiceNumber,
      fiscalNumber: invoice.fiscalNumber || "",
      zoi: invoice.zoi || "",
      eor: invoice.fiscalNumber || "",
      issueDateTime: invoice.issueDateTime.toISOString(),
      premiseId: invoice.premiseId,
      deviceId: invoice.deviceId,
      paymentMethod: invoice.paymentMethod,
      totalNet: Number(invoice.totalNet),
      totalVat: Number(invoice.totalVat),
      totalGross: Number(invoice.totalGross),
      items: invoice.items.map(i => ({
        name: i.name,
        qty: Number(i.quantity),
        price: Number(i.unitPrice),
        vatRate: Number(i.vatRate),
        net: Number(i.totalNet),
        vat: Number(i.totalVat),
      })),
      verifyUrl: invoice.verifyUrl || undefined,
    })

    await sendReceipt(email, `Invoice #${invoice.invoiceNumber}`, pdf)

    await db.invoice.update({
      where: { id: invoiceId },
      data: { emailedTo: email },
    })

    return { ok: true as const }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Send error"
    return { ok: false as const, error: msg }
  }
}
