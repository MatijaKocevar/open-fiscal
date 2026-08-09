import QRCode from "qrcode"

export function buildQrContent(opts: {
  taxNumber: string
  issueDateTime: string
  invoiceNumber: string
  premiseId: string
  deviceId: string
  totalGross: number
  zoi: string
  eor: string
}) {
  const date = typeof opts.issueDateTime === 'string'
    ? opts.issueDateTime
    : new Date(opts.issueDateTime).toISOString().replace('T', ' ').slice(0, 19)
  const amount = opts.totalGross.toFixed(2)
  return `${opts.taxNumber}|${date}|${opts.invoiceNumber}|${opts.premiseId}|${opts.deviceId}|${amount}|${opts.zoi}|${opts.eor}`
}

export async function generateQrDataUrl(content: string): Promise<string> {
  return QRCode.toDataURL(content, { width: 200, margin: 1 })
}
