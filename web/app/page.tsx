import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { RecentInvoicesList } from "@/app/invoices/_components/recent-invoices-list"

export const dynamic = "force-dynamic"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/pos">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">🛒 POS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">New invoice, cash, card</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/invoices">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">🧾 Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Overview of all issued invoices</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/reports">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">📈 Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">VAT, daily revenue</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <h2 className="text-lg font-semibold">Latest invoices</h2>
      <Suspense fallback={<Skeleton className="h-48 w-full" />}>
        <RecentInvoicesList />
      </Suspense>
    </div>
  )
}
