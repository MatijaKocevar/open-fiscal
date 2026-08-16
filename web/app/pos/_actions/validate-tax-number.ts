"use server"

import { validateVatViaViesApi } from "@/lib/vies"
import { isValidSlovenianTaxNumber, stripVatPrefix } from "@/lib/tax-number"

export async function validateTaxNumber(vatId: string) {
  if (!vatId) return { ok: true as const, result: null }

  const checksumOk = isValidSlovenianTaxNumber(vatId)

  const normalized = vatId.trim().toUpperCase()
  const withPrefix = normalized.startsWith("SI") ? normalized : `SI${stripVatPrefix(normalized)}`

  const viesResult = await validateVatViaViesApi(withPrefix)

  return {
    ok: true as const,
    result: {
      checksumOk,
      vies: viesResult,
    },
  }
}
