import { getTranslations } from "next-intl/server"
import { getCompany } from "@/lib/queries/company"
import { getAllPremises } from "@/lib/queries/premise"
import { getAllDevices } from "@/lib/queries/device"
import { CompanyCard } from "./_components/company-card"
import { PremisesCard } from "./_components/premises-card"
import { DevicesCard } from "./_components/devices-card"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const t = await getTranslations("settings")
  const [company, premises, devices] = await Promise.all([
    getCompany(),
    getAllPremises(),
    getAllDevices(),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <CompanyCard company={company} />
      <PremisesCard premises={premises} />
      <DevicesCard devices={devices} />
    </div>
  )
}
