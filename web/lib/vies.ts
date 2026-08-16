const VIESAC_BASE_URL = "https://viesac.eu/api/v1"

export interface VatValidationResult {
  vat: string
  country_code: string
  vat_number: string
  status: "valid" | "invalid" | "audit_required"
  checked_at: string
  name?: string
  address?: string
}

export async function validateVatViaViesac(vatNumber: string): Promise<VatValidationResult | null> {
  const apiKey = process.env.VIESAC_API_KEY
  if (!apiKey) return null

  const url = `${VIESAC_BASE_URL}/validate?vat=${encodeURIComponent(vatNumber)}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  })

  if (res.status === 429) return null
  if (!res.ok) return null

  return res.json()
}
