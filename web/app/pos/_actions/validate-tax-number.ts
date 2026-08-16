"use server"

import { validateVatViaViesac } from "@/lib/vies"
import { isValidSlovenianTaxNumber, isValidSlovenianVatId } from "@/lib/tax-number"

export async function validateTaxNumber(vatId: string) {
  if (!vatId) return { ok: true as const, result: null }

  const checksumOk = isValidSlovenianTaxNumber(vatId)

  const viesResult = await validateVatViaViesac(vatId)

  return {
    ok: true as const,
    result: {
      checksumOk,
      vies: viesResult,
    },
  }
}
