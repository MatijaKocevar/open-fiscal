import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"

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
  const t = useTranslations("settings")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("company")}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        {company ? (
          <>
            <p>{company.name}</p>
            <p className="text-muted-foreground">
              {company.address}, {company.postalCode} {company.city}
            </p>
            {company.taxNumber && <p>{t("taxNo")} {company.taxNumber}</p>}
            {company.iban && <p>{t("iban")} {company.iban}</p>}
          </>
        ) : (
          <p className="text-muted-foreground">{t("companyNotSetUp")}</p>
        )}
      </CardContent>
    </Card>
  )
}
