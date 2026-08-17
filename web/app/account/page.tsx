import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getUserById } from "@/lib/queries/users"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AccountForm } from "./_components/account-form"
import { PasswordForm } from "./_components/password-form"

export const dynamic = "force-dynamic"

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await getUserById(session.user.id)
  if (!user) redirect("/login")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Account</h1>
        <Badge variant="secondary" className="text-xs">
          {user.role}
        </Badge>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
            <CardDescription>Update your name and email</CardDescription>
          </CardHeader>
          <CardContent>
            <AccountForm name={user.name} email={user.email} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Password</CardTitle>
            <CardDescription>Change your password</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
