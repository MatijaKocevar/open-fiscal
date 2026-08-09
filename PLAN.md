# DPR Fiscal Invoice – Full Implementation Plan

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Docker Compose                                │
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐   │
│  │  Next.js 14   │    │  C# Bridge    │    │  PostgreSQL 16       │   │
│  │  (web/)       │    │  (furs-bridge/)│   │  :5432               │   │
│  │  :3000        │────│  :5100         │   │                      │   │
│  └──────┬────────┘    └──────┬───────┘    └──────────┬───────────┘   │
│         │                    │                        │               │
│         │  REST/JSON         │   mTLS (client cert)   │               │
│         └────────────────────┘                        │               │
│          Internal bridge      ┌─────▼──────────────┐  │               │
│          (HTTP)               │  FURS API           │  │               │
│                               │  :9002 (test)       │  │               │
│                               │  :9003 (prod)      │  │               │
│                               └────────────────────┘  │               │
│                                                        │               │
│   Prisma Client ──────────────────────────────────────┘               │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │  C# Bridge (.NET 8 Minimal API)                          │       │
│  │  - Production: mTLS to FURS, JWS (RS256) signing          │       │
│  │  - ZOI = MD5(RSA-SHA256(taxNum+date+invoiceNum+...))    │       │
│  │  - Mock mode: fake ZOI/EOR when certs not configured     │       │
│  │  - Endpoints: invoice, daily report, premise reg, echo   │       │
│  │  - Stateless — no DB, no local persistence               │       │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │  Next.js 14+ App Router                                   │       │
│  │  - TypeScript strict, Server Components by default         │       │
│  │  - Prisma ORM (PostgreSQL 16)                             │       │
│  │  - shadcn/ui, react-hook-form + zod                        │       │
│  │  - Zustand (cart + UI state only)                          │       │
│  │  - serwist PWA (offline queue, install prompt)             │       │
│  │  - sonner toasts, recharts, date-fns                       │       │
│  │  - jsPDF + qrcode (receipt PDFs)                           │       │
│  │  - Nodemailer (email receipts)                             │       │
│  │  - ESC/POS TCP printing                                    │       │
│  │  - Suspense streaming + skeletons per data region          │       │
│  └──────────────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────────┘
```

### Security boundaries
- C# Bridge bound to internal Docker network; never exposed to clients.
- FURS communication uses **mTLS** (two-way TLS) with SI-TRUST application + server certificates.
- Server Actions run Prisma on the server; no direct DB from browser.
- Certificate private keys on host filesystem, mounted read-only into bridge container.
- All secrets in `.env` (never committed).

### External boundaries
- **FURS** (Slovenian Tax Authority) – `blagajne.fu.gov.si:9003` (prod) / `blagajne-test.fu.gov.si:9002` (test).
- **PostgreSQL 16** – persistent store for all business data.
- **SMTP** – customer's email server for sending receipt PDFs.
- **ESC/POS thermal printer** – optional network-attached (TCP port 9100) or via USB serial.

### Reference documents
- `docs/TehnicnaDokumentacijaVer3.2.pdf` — DPR technical specification v3.2 (FURS, 125 pages).

---

## 2. Project Structure

```
company_app/
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── .gitignore
├── Makefile
├── PLAN.md
├── AGENTS.md
│
├── furs-bridge/                          # C# .NET 8 Minimal API
│   ├── furs-bridge.sln
│   ├── Dockerfile
│   └── src/
│       ├── Program.cs
│       ├── appsettings.json
│       ├── furs-bridge.csproj
│       ├── Services/
│       │   ├── IZoiCalculator.cs
│       │   ├── ZoiCalculator.cs          # MD5(RSA-SHA256(...))
│       │   ├── IJwsSigner.cs
│       │   ├── JwsSigner.cs              # RS256 JWS tokens
│       │   ├── IFursClient.cs
│       │   ├── FursClient.cs             # HTTP + mTLS to FURS
│       │   ├── MockZoiCalculator.cs
│       │   ├── MockJwsSigner.cs
│       │   ├── MockFursClient.cs
│       │   └── CertificateManager.cs
│       ├── Models/
│       │   ├── InvoiceRequest.cs
│       │   ├── InvoiceResponse.cs
│       │   ├── PremiseRequest.cs
│       │   ├── PremiseResponse.cs
│       │   ├── DailyReportRequest.cs
│       │   ├── DailyReportResponse.cs
│       │   └── ErrorResponse.cs
│       ├── Extensions/
│       │   └── ServiceCollectionExtensions.cs
│       └── Middleware/
│           └── ExceptionHandlingMiddleware.cs
│
├── furs-bridge-tests/                    # C# unit + integration tests
│   ├── Unit/
│   │   ├── ZoiCalculatorTests.cs
│   │   └── JwsSignerTests.cs
│   └── Integration/
│       └── FursClientTests.cs
│
├── certs/                                # TLS certificates (gitignored)
│   ├── app-cert.pfx                      # Application cert (private key)
│   ├── server-cert.cer                   # FURS server cert
│   ├── intermediate-ca.cer               # SI-TRUST intermediate CA
│   └── root-ca.cer                       # SI-TRUST root CA
│
├── docs/
│   └── TehnicnaDokumentacijaVer3.2.pdf   # DPR spec from FURS
│
├── scripts/
│   ├── backup.sh
│   ├── restore.sh
│   └── setup-dev.sh
│
└── web/                                  # Next.js 14+ App Router
    ├── Dockerfile
    ├── next.config.ts
    ├── tsconfig.json
    ├── eslint.config.mjs
    ├── vitest.config.ts
    ├── package.json
    │
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    │
    ├── schemas/                          # Global Zod schemas — shared across routes
    │   ├── invoice.ts
    │   ├── product.ts
    │   ├── customer.ts
    │   ├── appointment.ts
    │   ├── settings.ts
    │   └── bridge.ts
    │
    ├── lib/                              # Shared utilities — Prisma only in db.ts + queries/
    │   ├── db.ts                         # Prisma singleton (ONLY place @prisma/client is imported)
    │   ├── bridge.ts                     # C# bridge HTTP client + Zod response parsing
    │   ├── smtp.ts                       # Nodemailer wrapper for email receipts
    │   ├── qr.ts                         # QR code generation (DPR-spec content)
    │   ├── pdf.ts                        # Receipt PDF generator (jsPDF + QR image)
    │   ├── printer.ts                    # ESC/POS formatting + TCP send
    │   ├── vat.ts                        # Pure VAT calculation functions
    │   ├── toast-error.ts                # sonner error/success helpers
    │   ├── types.ts                      # Rare manual types (most inferred from Zod)
    │   │
    │   └── queries/                      # Shared data reads — one file per query + barrel
    │       ├── products/
    │       │   ├── get-available.ts
    │       │   ├── get-by-id.ts
    │       │   ├── search.ts
    │       │   ├── get-low-stock.ts
    │       │   └── index.ts              # barrel: re-exports all
    │       ├── invoices/
    │       │   ├── get-recent.ts
    │       │   ├── get-by-id.ts
    │       │   ├── get-by-customer.ts
    │       │   └── index.ts
    │       ├── customers/
    │       │   ├── get-all.ts
    │       │   ├── get-by-id.ts
    │       │   ├── search.ts
    │       │   └── index.ts
    │       ├── appointments/
    │       │   ├── get-by-date.ts
    │       │   ├── get-by-employee.ts
    │       │   └── index.ts
    │       ├── reports/
    │       │   ├── vat-summary.ts
    │       │   ├── daily-sales.ts
    │       │   └── index.ts
    │       └── settings/
    │           ├── get.ts
    │           └── index.ts
    │
    ├── stores/                           # Zustand — client-side only
    │   ├── cart.ts                       # items[], addItem, removeItem, clear, total, vatBreakdown
    │   └── ui.ts                         # sidebarOpen, activeModal, toggleSidebar, openModal, closeModal
    │
    ├── components/                       # Shared UI primitives only (shadcn)
    │   └── ui/
    │       ├── button.tsx
    │       ├── input.tsx
    │       ├── skeleton.tsx
    │       ├── table.tsx
    │       ├── card.tsx
    │       ├── sheet.tsx
    │       ├── badge.tsx
    │       ├── select.tsx
    │       ├── textarea.tsx
    │       └── toast.tsx
    │
    ├── app/                              # Routes + colocated code (_ prefix = hidden from router)
    │   ├── layout.tsx                    # Root shell: sidebar + header + sonner
    │   ├── page.tsx                      # Dashboard
    │   ├── globals.css
    │   │
    │   ├── setup/                        # First-run wizard (no auth required)
    │   │   ├── page.tsx
    │   │   └── _actions/
    │   │       ├── complete-setup.ts
    │   │       └── index.ts
    │   │
    │   ├── pos/                          # Point-of-sale checkout
    │   │   ├── page.tsx
    │   │   ├── _actions/
    │   │   │   ├── checkout.ts
    │   │   │   └── index.ts
    │   │   └── _components/
    │   │       ├── product-grid.tsx          # Server component (async)
    │   │       ├── product-grid-skeleton.tsx
    │   │       ├── product-card.tsx          # Client component
    │   │       ├── cart.tsx                  # Client (Zustand)
    │   │       ├── cart-item.tsx
    │   │       └── checkout-button.tsx
    │   │
    │   ├── invoices/                     # Invoice history & management
    │   │   ├── page.tsx
    │   │   ├── _actions/
    │   │   │   ├── void.ts
    │   │   │   ├── resend.ts
    │   │   │   └── index.ts
    │   │   ├── _components/
    │   │   │   ├── invoice-table.tsx         # Server component
    │   │   │   ├── invoice-table-skeleton.tsx
    │   │   │   └── invoice-table-row.tsx
    │   │   └── [id]/
    │   │       ├── page.tsx
    │   │       └── _components/
    │   │           └── invoice-detail.tsx
    │   │
    │   ├── products/                     # Inventory / product catalog
    │   │   ├── page.tsx
    │   │   ├── _actions/
    │   │   │   ├── create.ts
    │   │   │   ├── update.ts
    │   │   │   ├── delete.ts
    │   │   │   └── index.ts
    │   │   ├── _components/
    │   │   │   ├── product-list.tsx          # Server component
    │   │   │   ├── product-list-skeleton.tsx
    │   │   │   └── product-list-row.tsx
    │   │   └── [id]/
    │   │       ├── page.tsx
    │   │       └── _components/
    │   │           └── product-form.tsx
    │   │
    │   ├── customers/                    # CRM
    │   │   ├── page.tsx
    │   │   ├── _actions/
    │   │   │   ├── create.ts
    │   │   │   ├── update.ts
    │   │   │   ├── delete.ts
    │   │   │   └── index.ts
    │   │   ├── _components/
    │   │   │   ├── customer-list.tsx         # Server component
    │   │   │   ├── customer-list-skeleton.tsx
    │   │   │   └── customer-list-row.tsx
    │   │   └── [id]/
    │   │       ├── page.tsx
    │   │       └── _components/
    │   │           └── customer-detail.tsx
    │   │
    │   ├── schedule/                     # Appointments / bookings
    │   │   ├── page.tsx
    │   │   ├── _actions/
    │   │   │   ├── create.ts
    │   │   │   ├── cancel.ts
    │   │   │   └── index.ts
    │   │   └── _components/
    │   │       ├── calendar.tsx              # Client component
    │   │       └── appointment-form.tsx
    │   │
    │   ├── reports/                      # VAT & sales reports
    │   │   ├── page.tsx
    │   │   ├── _actions/
    │   │   │   ├── vat-summary.ts
    │   │   │   └── index.ts
    │   │   └── _components/
    │   │       ├── vat-summary.tsx           # Server component
    │   │       ├── vat-summary-skeleton.tsx
    │   │       └── date-range-picker.tsx     # Client component
    │   │
    │   └── admin/                        # Settings, certs, backups
    │       ├── page.tsx
    │       ├── _actions/
    │       │   ├── update-settings.ts
    │       │   ├── upload-cert.ts
    │       │   ├── restore-backup.ts
    │       │   └── index.ts
    │       └── _components/
    │           ├── settings-form.tsx
    │           ├── cert-status.tsx
    │           └── backup-list.tsx
    │
    └── tests/                            # Frontend tests
        ├── unit/
        │   └── lib/
        │       └── vat.test.ts
        └── integration/
            └── actions/
                └── checkout.test.ts
```

---

## 3. Hard Rules

| # | Rule | Detail |
|---|------|--------|
| 1 | **Prisma imports** | `@prisma/client` imported **only** in `lib/db.ts` and `lib/queries/*.ts`. Nowhere else. |
| 2 | **`"use server"`** | Only in `app/*/_actions/*.ts` and Server Component files. Never in `lib/`. |
| 3 | **`"use client"`** | Only when interactivity is needed (forms, cart, calendar). |
| 4 | **One action per file** | `checkout.ts` exports one function. Not `invoice.ts` with 6 exports. |
| 5 | **One query per file** | `get-by-id.ts` exports one function. Not `products.ts` with 10 exports. |
| 6 | **Barrel `index.ts`** | Each `_actions/` and `queries/<domain>/` folder has an `index.ts` that re-exports all. |
| 7 | **Skeleton next to component** | `product-grid.tsx` + `product-grid-skeleton.tsx` in the same folder. |
| 8 | **Schemas are global** | `schemas/` at web root. Types inferred via `z.infer`. No manual type duplication. |
| 9 | **Server Components by default** | Data fetched on server. Streaming via `<Suspense>` + skeleton fallbacks. |
| 10 | **Queries in lib, actions in routes** | Queries (reads) are shared → `lib/queries/`. Actions (mutations) are route-specific → `app/<route>/_actions/`. |
| 11 | **`_` prefix** | Folders hidden from the router: `_actions/`, `_components/`, `_queries/`. |
| 12 | **Colocation** | Everything a route needs lives in or under its route folder. |

### File size limits
- Components: ~150 lines max. Split into sub-components if longer.
- Actions: ~100 lines max. Extract shared logic if needed.
- Queries: ~50 lines max (usually just a Prisma call).
- `index.ts` barrel files: re-export lines only, no logic.

### No central dumpsters
```diff
- lib/utils.ts          (~400 lines, formatCurrency + generateQr + buildEmailBody + parseDate + ...)
+ lib/vat.ts            (~60 lines, pure VAT functions)
+ lib/qr.ts             (~30 lines, QR code generation)
+ lib/pdf.ts            (~100 lines, receipt PDF layout)
+ lib/bridge.ts         (~80 lines, bridge HTTP client + Zod parsing)
```

---

## 4. Database Schema (Prisma)

```prisma
model Company {
  id         String   @id @default(cuid())
  name       String
  taxNumber  String?   // Davčna številka (required for FURS)
  vatId      String?   // ID za DDV
  address    String
  city       String
  postalCode String
  phone      String?
  email      String?
  website    String?
  logoUrl    String?
  iban       String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Premise {
  id        String   @id @default(cuid())
  premiseId String   @unique  // FURS business premise ID
  name      String
  address   String
  city      String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}

model Device {
  id        String   @id @default(cuid())
  deviceId  String   @unique  // FURS electronic device ID
  name      String
  premiseId String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         String   @default("CASHIER") // OWNER | ADMIN | CASHIER
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Product {
  id        String   @id @default(cuid())
  name      String
  barcode   String?  @unique
  unitPrice Decimal  @db.Decimal(12, 2)
  vatRate   Decimal  @db.Decimal(5, 2)   // e.g. 25.00 = 25%
  unit      String   @default("kos")     // kos, kg, l, h, ...
  stockQty  Decimal  @default(0) @db.Decimal(10, 2)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Customer {
  id         String    @id @default(cuid())
  name       String
  vatId      String?   @unique  // OIB / ID za DDV
  address    String?
  city       String?
  postalCode String?
  phone      String?
  email      String?
  invoices   Invoice[]
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

model Invoice {
  id             String   @id @default(cuid())
  invoiceNumber  Int      @unique
  fiscalNumber   String?  // EOR — Enkratna identifikacijska oznaka računa (from FURS)
  zoi            String?  // Zaščitna oznaka izdajatelja (from FURS)
  jir            String?  // Identifikacijska oznaka računa (from FURS)
  qrCode         String?  // DPR QR code content string
  verifyUrl      String?  // FURS invoice verification URL
  totalNet       Decimal  @db.Decimal(12, 2)
  totalVat       Decimal  @db.Decimal(12, 2)
  totalGross     Decimal  @db.Decimal(12, 2)
  paymentMethod  String   @default("CASH") // CASH | CARD | TRANSFER
  issueDateTime  DateTime @default(now())
  deviceId       String
  premiseId      String
  emailedTo      String?

  customerId String?
  customer   Customer?         @relation(fields: [customerId], references: [id])
  items      InvoiceLineItem[]
  createdBy  String

  createdAt DateTime @default(now())
}

model InvoiceLineItem {
  id        String  @id @default(cuid())
  name      String
  quantity  Decimal @db.Decimal(10, 3)
  unitPrice Decimal @db.Decimal(12, 2)
  vatRate   Decimal @db.Decimal(5, 2)
  totalNet  Decimal @db.Decimal(12, 2)
  totalVat  Decimal @db.Decimal(12, 2)

  invoiceId String
  invoice   Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
}

model Appointment {
  id          String   @id @default(cuid())
  customerId  String
  date        DateTime
  durationMin Int      @default(60)
  serviceName String
  notes       String?
  isCancelled Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Settings {
  id    String @id @default("singleton")
  key   String @unique
  value String
}
```

---

## 5. Data Flow

### Invoices
```
 Components (server + client)
   ↓ never import @prisma/client directly
 lib/queries/ (reads: get-recent.ts, get-by-id.ts, ...)
   ↓
 lib/db.ts (Prisma singleton — only place prisma is imported)
```

```
'use client' POS page → Zustand cart
   ↓ checkout Server Action
 app/pos/_actions/checkout.ts
   ↓ computes VAT, calls bridge to FURS, saves to DB
   ↓ returns { success, invoiceId }
   ↓ Zustand: cart.clear()
   ↓ revalidatePath("/invoices")
   ↓ redirect to invoice detail
```

### Queries vs Actions
```
 Queries (lib/queries/)      Actions (app/*/_actions/)
 ─────────────────────       ─────────────────────────
 Reads from DB               Mutations (create, update, delete)
 Shared across routes        Route-specific behavior
 Import from lib/db.ts       Import from lib/queries/*.ts
 Server Components use them  Client Components call them
```

---

## 6. C# Bridge — DPR FURS Integration

### ZOI Calculation
```
ZOI = MD5( RSA-SHA256_Signature( taxNumber + IssueDateTime + InvoiceNumber + PremiseID + DeviceID + InvoiceAmount ) )
```
- Concatenation: UTF-8, no separators.
- Amount with decimal dot (e.g. `1245.56`).
- Signed with application certificate's private key (RSA-SHA256).
- Result hash: MD5 → 32-character hex string.

### JWS Signing (JSON mode)
- Algorithm: RS256
- Header: `{"alg":"RS256","subject_name":"<CN>","issuer_name":"<issuer>","serial":<cert_serial>}`
- Payload: `base64url(UTF8(JSON invoice))`
- Token: `BASE64URL(Header).BASE64URL(Payload)`, then signed.

### FURS API Endpoints (test :9002, prod :9003)

| Method | Path (JSON) | Purpose |
|--------|-------------|---------|
| POST | `/v1/cash_registers/invoices` | Submit single invoice |
| POST | `/v1/cash_registers_batch/invoices` | Submit batch invoices |
| POST | `/v1/cash_registers/invoices/register` | Register business premise |
| POST | `/v1/cash_registers/echo` | Echo/ping test |
| GET | `/cash_registers/ui/check_invoice/index.html` | Invoice verification (web) |

### FURS Error Codes
| Code | Description | Bridge maps to |
|------|-------------|----------------|
| S001 | XML schema violation | 422 |
| S002 | JSON schema violation | 422 |
| S003 | Invalid digital signature | 401 |
| S004 | Certificate serial unknown to ISFU | 401 |
| S005 | Tax number mismatch | 403 |
| S006 | Premise not registered / closed | 403 |
| S007 | Certificate revoked | 401 |
| S008 | Certificate expired | 401 |
| S100 | FURS system error | 502 (retryable) |

### Bridge Configuration

| Env Key | Default | Description |
|---------|---------|-------------|
| `BRIDGE_MOCK` | `"true"` | Use mock FURS client |
| `FURS_BASE_URL` | `"https://blagajne-test.fu.gov.si:9002"` | FURS API base |
| `CERT_STORE_PATH` | `"/certs"` | Mounted cert directory |
| `CERT_PASSWORD` | `""` | PFX password |
| `TAX_NUMBER` | `""` | Business tax number |
| `PREMISE_ID` | `""` | Business premise ID |
| `DEVICE_ID` | `""` | Electronic device ID |

### Mock Mode
`BRIDGE_MOCK=true` → all `ServiceCollectionExtensions` register mock implementations:
- `MockFursClient` — returns deterministic fake EOR/ZOI/JIR
- `MockZoiCalculator` — returns `MOCK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- `MockJwsSigner` — returns mock JWS token

---

## 7. Route Modules

| Route | Purpose | Auth | Rendering |
|-------|---------|------|-----------|
| `/` | Dashboard — daily stats, recent invoices, quick POS button | Any | SSR (streaming) |
| `/login` | Login page | Public | CSR |
| `/setup` | Self-serve wizard (6 steps: welcome → company → SMTP → certs → premise → complete) | Public | CSR |
| `/pos` | Point-of-sale: product grid, cart (Zustand), checkout | Any | CSR |
| `/invoices` | Invoice list with date filter, search, pagination | Any | SSR + CSR filter |
| `/invoices/[id]` | Invoice detail, PDF download, re-email, print | Any | SSR |
| `/products` | Product catalog | Any | SSR |
| `/products/[id]` | Edit product | Admin | CSR |
| `/customers` | Customer list | Any | SSR |
| `/customers/[id]` | Customer detail + invoice history | Any | SSR |
| `/customers/[id]/edit` | Edit customer | Any | CSR |
| `/schedule` | Appointment calendar | Any | CSR |
| `/reports` | VAT summary, daily/monthly sales breakdown | Owner | SSR |
| `/admin` | Settings form, cert status, backup list | Owner | SSR |

### API Routes
| Route | Purpose |
|-------|---------|
| `/api/auth/[...nextauth]` | Auth.js handler |
| `/api/bridge/[...path]` | Proxy to C# bridge |
| `/api/upload` | Certificate file upload |
| `/api/print` | ESC/POS thermal print |
| `/api/invoice/[id]/pdf` | Download invoice PDF |

---

## 8. Self-Serve Setup Wizard

```
Step 1         Step 2           Step 3           Step 4           Step 5           Step 6
┌─────────┐   ┌───────────┐    ┌───────────┐    ┌────────────┐   ┌───────────┐    ┌──────────┐
│ Welcome  │──▶│ Company   │───▶│ SMTP      │───▶│ Certificate│──▶│ Premise   │───▶│ Complete │
│         │   │ Info      │    │ Config    │    │ Upload     │   │ Registration│   │         │
│ "Get    │   │ Name,     │    │ Host, port,│   │ Upload     │   │ Premise ID, │   │ Summary,│
│ Started │   │ tax #,    │    │ user, pass,│   │ .pfx + .cer│   │ device ID,  │   │ "Save & │
│ with    │   │ address,  │    │ from email │   │ + CA certs │   │ address     │   │ Go to   │
│ DPR"    │   │ phone,    │    │ "Test" btn │   │ "Validate" │   │ "Register"  │   │ Dashboard│
│         │   │ IBAN      │    │            │   │ button     │   │ button      │   │         │
└─────────┘   └───────────┘    └───────────┘    └────────────┘   └───────────┘    └──────────┘
```

- Route: `app/setup/page.tsx` — single page, step state in `stores/ui.ts`.
- Each step is a colocated `_components/Step*.tsx` component.
- On complete: saves `Company`, `Settings`, `Premise`, `Device` via `_actions/complete-setup.ts`, redirects to `/login`.

---

## 9. Suspense + Skeleton Streaming

```tsx
// app/pos/page.tsx
export default function PosPage() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />           {/* async Server Component */}
        </Suspense>
      </div>
      <div>
        <Suspense fallback={<RecentInvoicesSkeleton />}>
          <RecentInvoices />
        </Suspense>
      </div>
    </div>
  )
}
```

Layout (sidebar + header) renders immediately. Each data section streams in independently as queries complete, with skeletons shown in the meantime.

---

## 10. Error Handling

### Server Actions
```ts
// Every action returns:
{ ok: true, data: T } | { ok: false, error: string }
```

### Bridge errors
| Scenario | Toast message |
|----------|--------------|
| Bridge unreachable | "Fiscal bridge unavailable. Check connection." |
| FURS timeout | "Tax authority not responding. Retry." |
| Invalid/expired cert | "Certificate invalid or expired. Check admin settings." |
| Premise closed (S006) | "Business premise not registered. Visit setup." |
| FURS system error (S100) | "Tax authority system error. Automatically retrying..." |

### Toast helpers
```ts
// lib/toast-error.ts
import { toast } from "sonner";

export function showError(message: string, duration = 6000) {
  toast.error(message, { duration, position: "bottom-right" });
}

export function showSuccess(message: string) {
  toast.success(message, { position: "bottom-right" });
}
```

### Zod validation
Mapped to `react-hook-form` field-level errors — no generic toast for validation.

---

## 11. PDF Invoice & QR Code

- **jsPDF** + **jspdf-autotable** for PDF layout.
- **qrcode** library to generate PNG → embed in PDF + send to ESC/POS printer.
- QR content (DPR spec Chapter 11):
  ```
  taxNumber|issueDateTime|invoiceNumber|premiseId|deviceId|totalGross|zoi|eor
  ```
- Pipe `|` separated, no spaces.
- Also stored in `Invoice.qrCode` column.
- ESC/POS printing via raw TCP socket to port 9100 (`lib/printer.ts`).

---

## 12. Email Receipts

- **Nodemailer** transporter built from SMTP settings stored during setup.
- `lib/smtp.ts` exports a `sendReceipt(to, subject, pdfBuffer)` function.
- SMTP settings stored in `Settings` table: `smtp_host`, `smtp_port`, `smtp_user`, `smtp_pass`, `smtp_from`.
- `Invoice.emailedTo` records whether a receipt was sent.

---

## 13. Zustand Stores

### `stores/cart.ts`
```ts
interface CartState {
  items: CartItem[];           // { productId, name, qty, unitPrice, vatRate }
  addItem(product): void;
  removeItem(productId): void;
  updateQuantity(productId, qty): void;
  clear(): void;
  totalNet: number;            // computed
  totalVat: number;            // computed
  totalGross: number;          // computed
  vatBreakdown: { rate: number, amount: number }[];
}
```

### `stores/ui.ts`
```ts
interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  toggleSidebar(): void;
  openModal(name: string): void;
  closeModal(): void;
}
```

---

## 14. PWA (serwist)

- Cache app shell (layout, CSS, JS) for offline access.
- `BackgroundSyncPlugin` queues checkout actions when offline → replays on connectivity.
- Install prompt via `_components/OfflineBanner.tsx`.
- Icons: `public/icons/icon-192.png`, `icon-512.png`.
- Manifest: `public/manifest.json`.
- Config in `next.config.ts` via `withSerwist(...)`.

---

## 15. Docker Compose

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${DB_NAME:-dpr_fiscal}
      POSTGRES_USER: ${DB_USER:-dpr}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-dpr_secret}
    ports: ["127.0.0.1:5432:5432"]
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "${DB_USER:-dpr}"]
      interval: 10s
      retries: 5

  bridge:
    build:
      context: ./furs-bridge
      dockerfile: Dockerfile
    environment:
      BRIDGE_MOCK: ${BRIDGE_MOCK:-true}
      FURS_BASE_URL: ${FURS_BASE_URL:-https://blagajne-test.fu.gov.si:9002}
      CERT_STORE_PATH: /certs
      CERT_PASSWORD: ${CERT_PASSWORD:-}
      TAX_NUMBER: ${TAX_NUMBER:-}
      PREMISE_ID: ${PREMISE_ID:-}
      DEVICE_ID: ${DEVICE_ID:-}
    ports: ["127.0.0.1:5100:8080"]
    volumes:
      - ./certs:/certs:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/health"]
      interval: 15s
      retries: 3

  app:
    build:
      context: ./web
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://${DB_USER:-dpr}:${DB_PASSWORD:-dpr_secret}@postgres:5432/${DB_NAME:-dpr_fiscal}
      BRIDGE_URL: http://bridge:8080
      AUTH_SECRET: ${AUTH_SECRET:-}
    ports: ["3000:3000"]
    depends_on:
      postgres:
        condition: service_healthy
      bridge:
        condition: service_healthy

volumes:
  pgdata:
```

---

## 16. Build Order (Phases)

### Phase 1 — Docker + Scaffolding + Bridge Core *(week 1)*
| # | Task |
|---|------|
| 1 | `docker-compose.yml` + `docker-compose.dev.yml` + PostgreSQL + app/bridge Dockerfiles |
| 2 | C# Bridge: `.sln`, projects (`Api`, `Core`, `Mock`, `Furs`), all DTOs/Models, DI wiring |
| 3 | Next.js scaffold: `create-next-app`, strict TS, Tailwind, shadcn init, sonner, zustand, prisma |

### Phase 2 — Bridge Implementation + Data Layer *(week 1-2)*
| # | Task |
|---|------|
| 4 | ZOI calculator, JWS signer, FURS client + mTLS, all bridge endpoints |
| 5 | Bridge unit tests (`ZoiCalculatorTests`, `JwsSignerTests`, `FursClientTests`) |
| 6 | Prisma schema (full), initial migration, `lib/db.ts` singleton |
| 7 | All Zod schemas (`schemas/*.ts`) |

### Phase 3 — Queries + Actions *(week 2-3)*
| # | Task |
|---|------|
| 8 | All shared queries (`lib/queries/*`) — one file per query, barrel exports |
| 9 | Bridge client (`lib/bridge.ts`) |
| 10 | Server actions for all modules (`app/*/_actions/`) |
| 11 | `lib/vat.ts`, `lib/smtp.ts`, `lib/qr.ts`, `lib/pdf.ts`, `lib/printer.ts` |

### Phase 4 — UI Shell + Setup Wizard *(week 3)*
| # | Task |
|---|------|
| 12 | Root layout: sidebar, header, offline banner, PWA config |
| 13 | Setup wizard (6 steps) with `complete-setup` action |

### Phase 5 — Route Modules *(week 3-5)*
| # | Task |
|---|------|
| 14 | Dashboard (`/`) |
| 15 | POS page: product grid, cart, checkout |
| 16 | Invoices: list, detail |
| 17 | Products: list, edit |
| 18 | Customers: list, detail, edit |
| 19 | Schedule: calendar, appointment form |
| 20 | Reports: VAT summary, daily sales |
| 21 | Admin: settings form, cert status, backup list |

### Phase 6 — Polish + Verify *(week 5-6)*
| # | Task |
|---|------|
| 22 | Suspense + skeleton wrappers on all SSR pages |
| 23 | Error boundaries |
| 24 | Responsive audit (mobile, tablet, desktop) |
| 25 | Backup & restore scripts |
| 26 | End-to-end flow: setup → POS sale → fiscalize → PDF → email |
| 27 | Performance check (Lighthouse) |
| 28 | README with setup instructions |

---

## 17. Backup Strategy

```bash
# scripts/backup.sh
#!/bin/bash
BACKUP_DIR="./backups"
DB_NAME="${DB_NAME:-dpr_fiscal}"
DB_USER="${DB_USER:-dpr}"
TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
mkdir -p "$BACKUP_DIR"
pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"
tar -czf "${BACKUP_DIR}/certs_${TIMESTAMP}.tar.gz" -C . certs/
echo "Backup saved: ${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"
```

### Policy
- Pre-migration backup before every `prisma migrate deploy`.
- Daily cron backup (retain 30 days).
- Monthly archive (retain 12 months).

### Restore
```bash
gunzip -c backup.sql.gz | psql -U dpr dpr_fiscal
```

---

## 18. Development Workflow

```bash
# First time
make setup-dev        # docker compose up -d postgres, npm i, dotnet restore, prisma migrate

# Daily dev
docker compose up -d postgres
dotnet run --project furs-bridge/src     # bridge on :5100 (mock mode)
cd web && npm run dev                    # Next.js on :3000

# Production
docker compose build && docker compose up -d
# → visit http://localhost:3000/setup

# Quality gates
npm run lint && npm run typecheck && npm run test
dotnet test
```

---

## 19. Environment Variables

```env
# Database
DB_NAME=dpr_fiscal
DB_USER=dpr
DB_PASSWORD=dpr_secret
DATABASE_URL=postgresql://dpr:dpr_secret@localhost:5432/dpr_fiscal

# C# Bridge
BRIDGE_URL=http://localhost:5100
BRIDGE_MOCK=true
FURS_BASE_URL=https://blagajne-test.fu.gov.si:9002
CERT_PASSWORD=
TAX_NUMBER=
PREMISE_ID=
DEVICE_ID=

# Next.js
AUTH_SECRET=change-me-at-least-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
