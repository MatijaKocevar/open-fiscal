import { z } from "zod"

export const BridgeHealthSchema = z.object({
  ok: z.boolean(),
  mock: z.boolean(),
})

export const BridgeInvoiceResponseSchema = z.object({
  success: z.boolean(),
  eor: z.string(),
  zoi: z.string(),
  jir: z.string(),
  qrCode: z.string().optional(),
  verifyUrl: z.string().optional(),
  timestamp: z.string(),
  isMock: z.boolean(),
})

export const BridgeDeviceInfoSchema = z.object({
  deviceId: z.string(),
  premiseId: z.string(),
  taxNumber: z.string(),
  isMock: z.boolean(),
})
