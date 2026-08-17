import bcrypt from "bcryptjs"
import { randomBytes, randomUUID } from "node:crypto"
import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

if (process.env.NODE_ENV !== "production") {
  try {
    process.loadEnvFile()
  } catch {
    // no .env file — rely on host/container env vars
  }
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter: new PrismaPg(pool) })

const round2 = (n: number) => Math.round(n * 100) / 100
const hex = (len: number) => randomBytes(len / 2).toString("hex")

const PASSWORD = "geslo123"

type SeedItem = { name: string; quantity: number; unitPrice: number; vatRate: number }

function lineTotals(items: SeedItem[]) {
  const lines = items.map((it) => {
    const totalNet = round2(it.quantity * it.unitPrice)
    const totalVat = round2(totalNet * (it.vatRate / 100))
    return { ...it, totalNet, totalVat }
  })
  const totalNet = round2(lines.reduce((s, l) => s + l.totalNet, 0))
  const totalVat = round2(lines.reduce((s, l) => s + l.totalVat, 0))
  return { lines, totalNet, totalVat, totalGross: round2(totalNet + totalVat) }
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000)
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000)

async function main() {
  console.log("Clearing existing data...")
  await db.invoiceLineItem.deleteMany()
  await db.invoice.deleteMany()
  await db.customer.deleteMany()
  await db.product.deleteMany()
  await db.appointment.deleteMany()
  await db.user.deleteMany()
  await db.device.deleteMany()
  await db.premise.deleteMany()
  await db.company.deleteMany()
  await db.settings.deleteMany()

  console.log("Seeding company / premise / device...")
  const company = await db.company.create({
    data: {
      name: "Kavarna Centrala d.o.o.",
      taxNumber: "12345678",
      vatId: "SI12345678",
      address: "Slovenska cesta 10",
      city: "Ljubljana",
      postalCode: "1000",
      phone: "+386 1 234 5678",
      email: "info@kavarna-centrala.si",
      iban: "SI56 0000 0000 0000 000",
    },
  })

  const premise = await db.premise.create({
    data: {
      premiseId: "PREMISE-001",
      name: "Kavarna Centrala - Ljubljana",
      address: "Slovenska cesta 10",
      city: "Ljubljana",
      isActive: true,
    },
  })

  const device = await db.device.create({
    data: {
      deviceId: "DEVICE-001",
      name: "Blagajna 1",
      premiseId: premise.premiseId,
      isActive: true,
    },
  })

  console.log("Seeding users...")
  const passwordHash = await bcrypt.hash(PASSWORD, 12)
  const owner = await db.user.create({
    data: { email: "owner@openfiscal.si", name: "Ana Novak", role: "OWNER", passwordHash },
  })
  await db.user.create({
    data: { email: "admin@openfiscal.si", name: "Bojan Kralj", role: "ADMIN", passwordHash },
  })
  await db.user.create({
    data: { email: "cashier@openfiscal.si", name: "Cvetka Zupan", role: "CASHIER", passwordHash },
  })

  console.log("Seeding products...")
  const products = [
    { name: "Espresso", barcode: "3830000000017", unitPrice: 1.5, vatRate: 9.5, stockQty: 1000 },
    { name: "Cappuccino", barcode: "3830000000024", unitPrice: 2.2, vatRate: 9.5, stockQty: 1000 },
    { name: "Bela kava", barcode: "3830000000031", unitPrice: 2.5, vatRate: 9.5, stockQty: 500 },
    { name: "Čaj", barcode: "3830000000048", unitPrice: 2.0, vatRate: 9.5, stockQty: 400 },
    { name: "Svež pomarančni sok", barcode: "3830000000055", unitPrice: 3.5, vatRate: 9.5, stockQty: 200 },
    { name: "Voda 0,5l", barcode: "3830000000062", unitPrice: 1.2, vatRate: 9.5, stockQty: 300 },
    { name: "Sendvič s pršutom", barcode: "3830000000079", unitPrice: 4.5, vatRate: 9.5, stockQty: 150 },
    { name: "Toast", barcode: "3830000000086", unitPrice: 3.0, vatRate: 9.5, stockQty: 100 },
    { name: "Rezina torte", barcode: "3830000000093", unitPrice: 3.8, vatRate: 9.5, stockQty: 80 },
    { name: "Kavna zrna 250g", barcode: "3830000000109", unitPrice: 12.9, vatRate: 22, stockQty: 60 },
    { name: "Skodelica OpenFiscal", barcode: "3830000000116", unitPrice: 8.5, vatRate: 22, stockQty: 120 },
    { name: "Termo steklenica", barcode: "3830000000123", unitPrice: 15.0, vatRate: 22, stockQty: 40 },
  ]
  await db.product.createMany({
    data: products.map((p) => ({ ...p, unit: "kos", isActive: true })),
  })

  console.log("Seeding customers...")
  const janez = await db.customer.create({
    data: { name: "Janez Novak", city: "Ljubljana", postalCode: "1000", phone: "+386 40 111 222" },
  })
  const maja = await db.customer.create({
    data: { name: "Maja Horvat", city: "Maribor", postalCode: "2000", email: "maja.horvat@example.si" },
  })
  const abc = await db.customer.create({
    data: { name: "Podjetje ABC d.o.o.", vatId: "SI98765432", address: "Trg republike 1", city: "Ljubljana", postalCode: "1000" },
  })
  const xyz = await db.customer.create({
    data: { name: "Bar XYZ d.o.o.", vatId: "SI11111111", address: "Glavni trg 5", city: "Celje", postalCode: "3000" },
  })

  console.log("Seeding invoices...")
  async function createInvoice(opts: {
    number: number
    date: Date
    paymentMethod: string
    customer?: { id: string; vatId?: string | null } | null
    items: SeedItem[]
    fiscalized: boolean
  }) {
    const { lines, totalNet, totalVat, totalGross } = lineTotals(opts.items)
    const fiscal = opts.fiscalized
      ? { fiscalNumber: randomUUID(), zoi: hex(32), jir: hex(32) }
      : {}
    return db.invoice.create({
      data: {
        invoiceNumber: opts.number,
        issueDateTime: opts.date,
        paymentMethod: opts.paymentMethod,
        customerId: opts.customer?.id ?? null,
        customerVatId: opts.customer?.vatId ?? null,
        deviceId: device.deviceId,
        premiseId: premise.premiseId,
        createdBy: owner.email,
        totalNet,
        totalVat,
        totalGross,
        ...fiscal,
        items: {
          create: lines.map((l) => ({
            name: l.name,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            vatRate: l.vatRate,
            totalNet: l.totalNet,
            totalVat: l.totalVat,
          })),
        },
      },
    })
  }

  const invoices: Parameters<typeof createInvoice>[0][] = [
    { number: 1, date: hoursAgo(6), paymentMethod: "CASH", customer: janez, fiscalized: true, items: [
      { name: "Espresso", quantity: 2, unitPrice: 1.5, vatRate: 9.5 },
      { name: "Cappuccino", quantity: 1, unitPrice: 2.2, vatRate: 9.5 },
    ] },
    { number: 2, date: hoursAgo(5), paymentMethod: "CARD", customer: maja, fiscalized: true, items: [
      { name: "Bela kava", quantity: 1, unitPrice: 2.5, vatRate: 9.5 },
      { name: "Rezina torte", quantity: 2, unitPrice: 3.8, vatRate: 9.5 },
    ] },
    { number: 3, date: hoursAgo(4), paymentMethod: "CASH", customer: null, fiscalized: true, items: [
      { name: "Espresso", quantity: 1, unitPrice: 1.5, vatRate: 9.5 },
    ] },
    { number: 4, date: hoursAgo(2), paymentMethod: "CASH", customer: null, fiscalized: false, items: [
      { name: "Espresso", quantity: 1, unitPrice: 1.5, vatRate: 9.5 },
      { name: "Toast", quantity: 1, unitPrice: 3.0, vatRate: 9.5 },
    ] },
    { number: 5, date: daysAgo(1), paymentMethod: "CARD", customer: abc, fiscalized: true, items: [
      { name: "Sendvič s pršutom", quantity: 2, unitPrice: 4.5, vatRate: 9.5 },
      { name: "Voda 0,5l", quantity: 2, unitPrice: 1.2, vatRate: 9.5 },
      { name: "Svež pomarančni sok", quantity: 1, unitPrice: 3.5, vatRate: 9.5 },
    ] },
    { number: 6, date: daysAgo(1), paymentMethod: "CASH", customer: null, fiscalized: true, items: [
      { name: "Čaj", quantity: 1, unitPrice: 2.0, vatRate: 9.5 },
      { name: "Toast", quantity: 1, unitPrice: 3.0, vatRate: 9.5 },
    ] },
    { number: 7, date: daysAgo(3), paymentMethod: "CARD", customer: xyz, fiscalized: true, items: [
      { name: "Kavna zrna 250g", quantity: 2, unitPrice: 12.9, vatRate: 22 },
    ] },
    { number: 8, date: daysAgo(5), paymentMethod: "CASH", customer: janez, fiscalized: true, items: [
      { name: "Cappuccino", quantity: 1, unitPrice: 2.2, vatRate: 9.5 },
      { name: "Sendvič s pršutom", quantity: 1, unitPrice: 4.5, vatRate: 9.5 },
    ] },
    { number: 9, date: daysAgo(8), paymentMethod: "CARD", customer: maja, fiscalized: true, items: [
      { name: "Svež pomarančni sok", quantity: 2, unitPrice: 3.5, vatRate: 9.5 },
      { name: "Rezina torte", quantity: 2, unitPrice: 3.8, vatRate: 9.5 },
    ] },
    { number: 10, date: daysAgo(12), paymentMethod: "CASH", customer: null, fiscalized: true, items: [
      { name: "Espresso", quantity: 2, unitPrice: 1.5, vatRate: 9.5 },
      { name: "Voda 0,5l", quantity: 2, unitPrice: 1.2, vatRate: 9.5 },
    ] },
    { number: 11, date: daysAgo(20), paymentMethod: "CARD", customer: abc, fiscalized: true, items: [
      { name: "Skodelica OpenFiscal", quantity: 4, unitPrice: 8.5, vatRate: 22 },
      { name: "Termo steklenica", quantity: 2, unitPrice: 15.0, vatRate: 22 },
    ] },
  ]

  for (const inv of invoices) {
    await createInvoice(inv)
  }

  console.log("Seeding appointments...")
  await db.appointment.createMany({
    data: [
      {
        customerId: owner.id,
        date: hoursAgo(-2),
        durationMin: 60,
        serviceName: "Sestanek s stranko",
        notes: "Pregled naročil za kavna zrna",
      },
      {
        customerId: owner.id,
        date: hoursAgo(-5),
        durationMin: 30,
        serviceName: "Dostava kave",
        notes: null,
      },
      {
        customerId: owner.id,
        date: hoursAgo(-26),
        durationMin: 90,
        serviceName: "Pregled poslovanja",
        notes: "Mesečno poročilo",
      },
    ],
  })

  console.log("\nSeed complete!")
  console.log("Company:", company.name)
  console.log("Users (password:", PASSWORD + "):")
  console.log("  - owner@openfiscal.si   (OWNER)")
  console.log("  - admin@openfiscal.si   (ADMIN)")
  console.log("  - cashier@openfiscal.si (CASHIER)")
  console.log(`Created ${products.length} products, 4 customers, ${invoices.length} invoices, 3 appointments.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await db.$disconnect()
    await pool.end()
  })
