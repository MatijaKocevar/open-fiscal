import { z } from "zod"

export const ProductCreateSchema = z.object({
  name: z.string().min(1),
  barcode: z.string().optional(),
  unitPrice: z.number().nonnegative(),
  vatRate: z.number().min(0).max(100),
  unit: z.string().default("kos"),
})

export const ProductUpdateSchema = ProductCreateSchema.partial()

export type ProductCreate = z.infer<typeof ProductCreateSchema>
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>
