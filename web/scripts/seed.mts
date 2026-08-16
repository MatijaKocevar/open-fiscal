import { PrismaClient } from "../app/generated/prisma/client.ts"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import bcrypt from "bcryptjs"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL || "postgresql://dpr:dpr_secret@localhost:5432/dpr_fiscal" })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

// Idempotent: wipe and recreate demo data
await db.invoiceLineItem.deleteMany()
await db.invoice.deleteMany()
await db.customer.deleteMany()
await db.product.deleteMany()
await db.appointment.deleteMany()
await db.device.deleteMany()
await db.premise.deleteMany()
await db.settings.deleteMany()
await db.user.deleteMany()
await db.company.deleteMany()

await db.company.create({ data: { name: "Demo d.o.o.", taxNumber: "10044728", vatId: "SI10044728", address: "Slovenska cesta 1", city: "Ljubljana", postalCode: "1000", phone: "01 234 56 78", email: "info@demo.si", iban: "SI56 0201 0123 4567 890" } })

const hash = await bcrypt.hash("demo1234", 12)
await db.user.create({ data: { email: "admin@demo.si", passwordHash: hash, name: "Admin", role: "OWNER" } })

await db.premise.create({ data: { premiseId: "BLAG01", name: "Main POS", address: "Slovenska cesta 1", city: "Ljubljana" } })
await db.device.create({ data: { deviceId: "NAP01", name: "Register 1", premiseId: "BLAG01" } })

const products = await Promise.all([
  db.product.create({ data: { name: "Espresso", unitPrice: 1.80, vatRate: 22, unit: "pcs" } }),
  db.product.create({ data: { name: "Cappuccino", unitPrice: 2.50, vatRate: 22, unit: "pcs" } }),
  db.product.create({ data: { name: "Latte Macchiato", unitPrice: 2.80, vatRate: 22, unit: "pcs" } }),
  db.product.create({ data: { name: "Tea (lemon)", unitPrice: 1.60, vatRate: 22, unit: "pcs" } }),
  db.product.create({ data: { name: "Hot Chocolate", unitPrice: 2.90, vatRate: 22, unit: "pcs" } }),
  db.product.create({ data: { name: "Ham Toast", unitPrice: 4.50, vatRate: 22, unit: "pcs" } }),
  db.product.create({ data: { name: "Donut", unitPrice: 2.00, vatRate: 22, unit: "pcs" } }),
  db.product.create({ data: { name: "Sandwich", unitPrice: 5.00, vatRate: 22, unit: "pcs" } }),
])

await db.customer.createMany({ data: [
  { name: "Janez Novak", vatId: "30000009", city: "Ljubljana" },
  { name: "Maja Kranjc", city: "Maribor" },
  { name: "ABC Company Ltd.", vatId: "40000001", city: "Celje" },
] })

const now = new Date()
for (let i = 0; i < 12; i++) {
  const date = new Date(now)
  date.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60))
  date.setDate(now.getDate() - Math.floor(Math.random() * 7))
  const cnt = 1 + Math.floor(Math.random() * 5)
  const items: Array<{ name: string; quantity: number; unitPrice: number; vatRate: number; totalNet: number; totalVat: number }> = []
  let tn = 0, tv = 0
  for (let j = 0; j < cnt; j++) {
    const p = products[Math.floor(Math.random() * products.length)]
    const q = 1 + Math.floor(Math.random() * 4)
    const n = Math.round(Number(p.unitPrice) * q * 100) / 100
    const v = Math.round(n * Number(p.vatRate) / 100 * 100) / 100
    items.push({ name: p.name, quantity: q, unitPrice: Number(p.unitPrice), vatRate: Number(p.vatRate), totalNet: n, totalVat: v })
    tn += n; tv += v
  }
  const eor = "MOCK-EOR-" + (1001 + i).toString().padStart(8, "0")
  await db.invoice.create({ data: {
    invoiceNumber: 1001 + i, fiscalNumber: eor,
    zoi: "MOCK-" + Math.random().toString(36).slice(2, 34),
    jir: "MOCK-JIR-" + (1001 + i),
    totalNet: Math.round(tn * 100) / 100, totalVat: Math.round(tv * 100) / 100,
    totalGross: Math.round((tn + tv) * 100) / 100,
    paymentMethod: ["CASH", "CARD"][i % 2],
    issueDateTime: date, deviceId: "NAP01", premiseId: "BLAG01",
    createdBy: "admin@demo.si",
    items: { create: items },
  } })
}

await db.settings.createMany({ data: [
  { key: "smtp_host", value: "smtp.demo.si" },
  { key: "smtp_port", value: "587" },
  { key: "smtp_user", value: "noreply@demo.si" },
  { key: "smtp_pass", value: "demo" },
  { key: "smtp_from", value: "noreply@demo.si" },
] })

console.log("Done: admin@demo.si / demo1234, 8 products, 3 customers, 12 invoices")
await db.$disconnect()
await pool.end()
