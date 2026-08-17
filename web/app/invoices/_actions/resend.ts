"use server"

import { db } from "@/lib/db"
import { generateReceiptPdf } from "@/lib/pdf"
import { sendReceipt } from "@/lib/smtp"
import { getActionTranslations, getActionLocale } from "@/lib/i18n"

export async function resendReceipt(invoiceId: string, email: string) {
  const t = await getActionTranslations("errors")
  const tr = await getActionTranslations("receipt")
  const locale = await getActionLocale()

  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: true, customer: true },
  })

  if (!invoice) return { ok: false as const, error: t("invoiceNotFound") }

  const company = await db.company.findFirst()
  if (!company) return { ok: false as const, error: t("companyNotSetUp") }

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
    }, locale)

    await sendReceipt(
      email,
      tr("emailSubject", { number: invoice.invoiceNumber }),
      tr("emailBody"),
      pdf
    )

    await db.invoice.update({
      where: { id: invoiceId },
      data: { emailedTo: email },
    })

    return { ok: true as const }
  } catch (error) {
    const msg = error instanceof Error ? error.message : t("sendError")
    return { ok: false as const, error: msg }
  }
}
