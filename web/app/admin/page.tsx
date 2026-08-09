import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth"
import { UserForm } from "./_components/user-form"
import { UserList } from "./_components/user-list"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const company = await db.company.findFirst()
  const [premises, devices, users] = await Promise.all([
    db.premise.findMany(),
    db.device.findMany(),
    db.user.findMany({ orderBy: { createdAt: "desc" } }),
  ])

  const session = await auth()
  const role = session?.user?.role

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {role === "OWNER" && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Users</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <UserList users={users} />
            <UserForm />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-lg">Company</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-1">
          {company ? (
            <>
              <p>{company.name}</p>
              <p className="text-muted-foreground">{company.address}, {company.postalCode} {company.city}</p>
              {company.taxNumber && <p>Tax no.: {company.taxNumber}</p>}
              {company.iban && <p>IBAN: {company.iban}</p>}
            </>
          ) : (
            <p className="text-muted-foreground">Company not set up. Visit the setup wizard.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Business premises</CardTitle></CardHeader>
        <CardContent className="text-sm">
          {premises.length === 0 ? (
            <p className="text-muted-foreground">No registered premises.</p>
          ) : (
            <ul className="space-y-1">
              {premises.map((p) => (
                <li key={p.id}>
                  {p.name} ({p.premiseId}) - {p.isActive ? "Active" : "Closed"}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Devices</CardTitle></CardHeader>
        <CardContent className="text-sm">
          {devices.length === 0 ? (
            <p className="text-muted-foreground">No registered devices.</p>
          ) : (
            <ul className="space-y-1">
              {devices.map((d) => (
                <li key={d.id}>
                  {d.name} ({d.deviceId}) - Premise: {d.premiseId}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
