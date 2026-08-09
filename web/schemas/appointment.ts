import { z } from "zod"

export const AppointmentCreateSchema = z.object({
  customerId: z.string().min(1),
  date: z.date(),
  durationMin: z.number().int().positive().default(60),
  serviceName: z.string().min(1),
  notes: z.string().optional(),
})

export const AppointmentCancelSchema = z.object({
  id: z.string().min(1),
})

export type AppointmentCreate = z.infer<typeof AppointmentCreateSchema>
