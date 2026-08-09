import jsPDF from "jspdf"
import "jspdf-autotable"
import { generateQrDataUrl, buildQrContent } from "./qr"

export interface ReceiptData {
  companyName: string
  companyAddress: string
  companyCity: string
  companyTaxNumber: string
  invoiceNumber: number
  fiscalNumber: string
  zoi: string
  eor: string
  issueDateTime: string
  premiseId: string
  deviceId: string
  paymentMethod: string
  totalNet: number
  totalVat: number
  totalGross: number
  items: Array<{ name: string; qty: number; price: number; vatRate: number; net: number; vat: number }>
  verifyUrl?: string
}

export async function generateReceiptPdf(data: ReceiptData): Promise<Buffer> {
  const doc = new jsPDF({ unit: "mm", format: [80, 200] })
  let y = 10

  doc.setFontSize(10)
  doc.text(data.companyName, 40, y, { align: "center" })
  y += 5
  doc.setFontSize(7)
  doc.text(data.companyAddress, 40, y, { align: "center" })
  y += 4
  doc.text(data.companyCity, 40, y, { align: "center" })
  y += 4
  doc.text(`Davčna št.: ${data.companyTaxNumber}`, 40, y, { align: "center" })
  y += 6

  doc.text(`Račun št: ${data.invoiceNumber}`, 5, y)
  doc.text(data.issueDateTime, 75, y, { align: "right" })
  y += 4
  doc.text(`EOR: ${data.eor}`, 5, y)
  y += 4
  doc.text(`ZOI: ${data.zoi}`, 5, y)
  y += 2

  const rows = data.items.map(item => [
    item.name,
    `${item.qty} x ${item.price.toFixed(2)}`,
    item.net.toFixed(2)
  ])

  ;(doc as any).autoTable({
    startY: y,
    head: [["Naziv", "Kol x Cena", "ZNESEK"]],
    body: rows,
    theme: "plain",
    styles: { fontSize: 6, cellPadding: 1 },
    headStyles: { fontSize: 6, fontStyle: "bold" },
    margin: { left: 3, right: 3 },
  })

  y = (doc as any).lastAutoTable.finalY + 3

  doc.setFontSize(8)
  doc.text(`SKUPAJ: ${data.totalGross.toFixed(2)} EUR`, 75, y, { align: "right" })
  y += 4
  doc.setFontSize(6)
  doc.text(`DDV: ${data.totalVat.toFixed(2)} EUR`, 75, y, { align: "right" })
  y += 4
  doc.text(`Plačilo: ${data.paymentMethod}`, 5, y)
  y += 6

  const qrContent = buildQrContent({
    taxNumber: data.companyTaxNumber,
    issueDateTime: data.issueDateTime,
    invoiceNumber: data.invoiceNumber.toString(),
    premiseId: data.premiseId,
    deviceId: data.deviceId,
    totalGross: data.totalGross,
    zoi: data.zoi,
    eor: data.eor,
  })

  const qrUrl = await generateQrDataUrl(qrContent)
  doc.addImage(qrUrl, "PNG", 25, y, 30, 30)

  if (data.verifyUrl) {
    y += 35
    doc.setFontSize(5)
    doc.text(data.verifyUrl, 40, y, { align: "center" })
  }

  return Buffer.from(doc.output("arraybuffer"))
}
