const VIES_API_BASE_URL = process.env.VIES_API_BASE_URL || "https://viesapi.eu/api"

export interface ViesTraderData {
  countryCode: string
  vatNumber: string
  valid: boolean
  traderName: string | null
  traderAddress: string | null
  id: string | null
  date: string
}

export async function validateVatViaViesApi(vatNumber: string): Promise<ViesTraderData | null> {
  const keyId = process.env.VIES_API_KEY_ID
  const key = process.env.VIES_API_KEY
  if (!keyId || !key) return null

  const auth = Buffer.from(`${keyId}:${key}`).toString("base64")

  const url = `${VIES_API_BASE_URL}/get/vies/euvat/${encodeURIComponent(vatNumber)}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
    cache: "no-store",
  })

  if (!res.ok) return null

  return res.json()
}
