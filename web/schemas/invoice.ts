import { z } from "zod"

export const InvoiceLineItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  vatRate: z.number().min(0).max(100),
  totalNet: z.number().nonnegative(),
  totalVat: z.number().nonnegative(),
})

export const InvoiceCreateSchema = z.object({
  paymentMethod: z.enum(["CASH", "CARD", "TRANSFER"]).default("CASH"),
  customerId: z.string().optional(),
  customerVatId: z.string().optional(),
  items: z.array(InvoiceLineItemSchema).min(1),
})

export type InvoiceCreate = z.infer<typeof InvoiceCreateSchema>
export type InvoiceLineItem = z.infer<typeof InvoiceLineItemSchema>
