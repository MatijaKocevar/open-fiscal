import { z } from "zod"

export const SmtpConfigSchema = z.object({
  smtp_host: z.string().min(1, "SMTP gostitelj je obvezen"),
  smtp_port: z.string().regex(/^\d+$/, "Vrata morajo biti številka").default("587"),
  smtp_user: z.string().min(1, "Uporabnik je obvezen"),
  smtp_pass: z.string(),
  smtp_from: z.string().min(1, "Pošiljatelj je obvezen"),
})

export const CompanyInfoSchema = z.object({
  name: z.string().min(1),
  taxNumber: z.string().optional(),
  vatId: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().optional(),
  iban: z.string().optional(),
})

export const SetupCompleteSchema = CompanyInfoSchema.extend({
  ...SmtpConfigSchema.shape,
  premiseId: z.string().min(1),
  premiseName: z.string().min(1),
  premiseAddress: z.string().min(1),
  premiseCity: z.string().min(1),
  deviceId: z.string().min(1),
  deviceName: z.string().min(1),
  certPassword: z.string().optional(),
  adminEmail: z.string().email().optional(),
  adminPassword: z.string().min(6).optional(),
})

export type SmtpConfig = z.infer<typeof SmtpConfigSchema>
export type CompanyInfo = z.infer<typeof CompanyInfoSchema>
export type SetupComplete = z.infer<typeof SetupCompleteSchema>
