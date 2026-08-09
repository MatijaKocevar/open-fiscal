const BRIDGE_URL = process.env.BRIDGE_URL || "http://localhost:5100"

export interface BridgeInvoiceResponse {
  success: boolean
  eor: string
  zoi: string
  jir: string
  qrCode?: string
  verifyUrl?: string
  timestamp: string
  isMock: boolean
}

export async function bridgeFetch<T>(path: string, body?: unknown): Promise<T> {
  const url = `${BRIDGE_URL}${path}`
  const options: RequestInit = {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
  }
  if (body) options.body = JSON.stringify(body)

  const res = await fetch(url, options)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Bridge error ${res.status}: ${text}`)
  }
  return res.json()
}

export async function sendInvoiceToBridge(request: {
  taxNumber: string
  issueDateTime: string
  invoiceNumber: string
  premiseId: string
  deviceId: string
  invoiceAmount: number
  paymentMethod: string
  items: Array<{ name: string; quantity: number; unitPrice: number; vatRate: number; totalNet: number; totalVat: number }>
  customerVatId?: string
}): Promise<BridgeInvoiceResponse> {
  return bridgeFetch<BridgeInvoiceResponse>("/api/invoice", request)
}

export async function checkBridgeHealth(): Promise<{ ok: boolean; mock: boolean }> {
  return bridgeFetch("/api/health")
}

export async function registerPremise(request: {
  taxNumber: string
  premiseId: string
  premiseName: string
  address: string
  city: string
  postalCode: string
  deviceId?: string
}) {
  return bridgeFetch("/api/premise/register", request)
}
