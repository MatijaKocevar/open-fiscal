import { z } from "zod"

export const CustomerCreateSchema = z.object({
  name: z.string().min(1),
  vatId: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
})

export const CustomerUpdateSchema = CustomerCreateSchema.partial()

export type CustomerCreate = z.infer<typeof CustomerCreateSchema>
export type CustomerUpdate = z.infer<typeof CustomerUpdateSchema>
