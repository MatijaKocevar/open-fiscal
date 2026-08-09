import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"

export default async function AdminPage() {
  const company = await db.company.findFirst()
  const [premises, devices] = await Promise.all([
    db.premise.findMany(),
    db.device.findMany(),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nastavitve</h1>

      <Card>
        <CardHeader><CardTitle className="text-lg">Podjetje</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-1">
          {company ? (
            <>
              <p>{company.name}</p>
              <p className="text-muted-foreground">{company.address}, {company.postalCode} {company.city}</p>
              {company.taxNumber && <p>Davčna št.: {company.taxNumber}</p>}
              {company.iban && <p>IBAN: {company.iban}</p>}
            </>
          ) : (
            <p className="text-muted-foreground">Podjetje ni nastavljeno. Obiščite čarovnika.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Poslovni prostori</CardTitle></CardHeader>
        <CardContent className="text-sm">
          {premises.length === 0 ? (
            <p className="text-muted-foreground">Ni registriranih prostorov.</p>
          ) : (
            <ul className="space-y-1">
              {premises.map((p) => (
                <li key={p.id}>
                  {p.name} ({p.premiseId}) - {p.isActive ? "Aktiven" : "Zaprt"}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Naprave</CardTitle></CardHeader>
        <CardContent className="text-sm">
          {devices.length === 0 ? (
            <p className="text-muted-foreground">Ni registriranih naprav.</p>
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
