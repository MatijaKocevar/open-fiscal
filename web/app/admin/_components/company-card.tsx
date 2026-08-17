import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type CompanyCardProps = {
  company: {
    name: string
    address: string
    postalCode: string
    city: string
    taxNumber: string | null
    iban: string | null
  } | null
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Company</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        {company ? (
          <>
            <p>{company.name}</p>
            <p className="text-muted-foreground">
              {company.address}, {company.postalCode} {company.city}
            </p>
            {company.taxNumber && <p>Tax no.: {company.taxNumber}</p>}
            {company.iban && <p>IBAN: {company.iban}</p>}
          </>
        ) : (
          <p className="text-muted-foreground">Company not set up. Visit the setup wizard.</p>
        )}
      </CardContent>
    </Card>
  )
}
