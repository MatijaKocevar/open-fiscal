export function normalizeTaxNumber(input: string): string {
  return input.replace(/[^0-9]/g, "")
}

export function stripVatPrefix(input: string): string {
  const trimmed = input.trim().toUpperCase()
  if (trimmed.startsWith("SI")) {
    return normalizeTaxNumber(trimmed.slice(2))
  }
  return normalizeTaxNumber(trimmed)
}

export function isValidSlovenianTaxNumber(input: string): boolean {
  const digits = stripVatPrefix(input)
  if (digits.length !== 8) return false

  const weights = [8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 7; i++) {
    sum += weights[i] * parseInt(digits[i], 10)
  }
  sum += parseInt(digits[7], 10)

  return sum % 11 === 0
}

export function isValidSlovenianVatId(input: string): boolean {
  const trimmed = input.trim().toUpperCase()
  if (!trimmed.startsWith("SI")) return false
  return isValidSlovenianTaxNumber(trimmed)
}
