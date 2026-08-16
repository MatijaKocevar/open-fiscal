"use server"

import { validateVatViaViesApi } from "@/lib/vies"
import { isValidSlovenianTaxNumber } from "@/lib/tax-number"

export async function validateTaxNumber(vatId: string) {
  if (!vatId) return { ok: true as const, result: null }

  const checksumOk = isValidSlovenianTaxNumber(vatId)

  const viesResult = await validateVatViaViesApi(vatId)

  return {
    ok: true as const,
    result: {
      checksumOk,
      vies: viesResult,
    },
  }
}
