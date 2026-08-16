"use server"

import { validateVatViaViesApi } from "@/lib/vies"
import { isValidSlovenianTaxNumber, stripVatPrefix } from "@/lib/tax-number"

export async function validateTaxNumber(vatId: string) {
  if (!vatId) return { ok: true as const, result: null }

  const checksumOk = isValidSlovenianTaxNumber(vatId)

  const normalized = vatId.trim().toUpperCase()
  const hasCountryPrefix = /^[A-Z]{2}/.test(normalized)
  const countryCode = hasCountryPrefix ? normalized.slice(0, 2) : "SI"
  const vatNumber = hasCountryPrefix ? normalized.slice(2) : stripVatPrefix(normalized)

  const viesResult = await validateVatViaViesApi(countryCode, vatNumber)

  return {
    ok: true as const,
    result: {
      checksumOk,
      vies: viesResult,
    },
  }
}
