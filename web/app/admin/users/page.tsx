import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { getTranslations } from "next-intl/server"
import { getAllUsers } from "@/lib/queries/users"
import { UserForm } from "./_components/user-form"
import { UserList } from "./_components/user-list"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  const session = await auth()
  if (session?.user?.role !== "OWNER") redirect("/admin")

  const t = await getTranslations("users")

  const users = (await getAllUsers()).map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    isActive: u.isActive,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Card>
        <CardContent className="space-y-4">
          <UserList users={users} />
          <UserForm />
        </CardContent>
      </Card>
    </div>
  )
}
