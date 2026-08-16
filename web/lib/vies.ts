const VIES_SOAP_URL = "https://ec.europa.eu/taxation_customs/vies/services/checkVatService"

export interface ViesTraderData {
  countryCode: string
  vatNumber: string
  valid: boolean
  traderName: string | null
  traderAddress: string | null
  requestDate: string
}

export async function validateVatViaViesApi(countryCode: string, vatNumber: string): Promise<ViesTraderData | null> {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <checkVat xmlns="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
      <countryCode>${countryCode}</countryCode>
      <vatNumber>${vatNumber}</vatNumber>
    </checkVat>
  </soap:Body>
</soap:Envelope>`

  const res = await fetch(VIES_SOAP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "",
    },
    body,
    cache: "no-store",
  })

  if (!res.ok) return null

  const xml = await res.text()

  const pick = (tag: string) => {
    const match = xml.match(new RegExp(`<[^>]*:?${tag}[^>]*>([\\s\\S]*?)<\\/[^>]*:?${tag}>`))
    return match ? match[1].trim() : null
  }

  const validStr = pick("valid")
  if (validStr === null) return null

  return {
    countryCode: pick("countryCode") ?? "",
    vatNumber: pick("vatNumber") ?? vatNumber,
    valid: validStr.toLowerCase() === "true",
    traderName: pick("name"),
    traderAddress: pick("address"),
    requestDate: pick("requestDate") ?? "",
  }
}
