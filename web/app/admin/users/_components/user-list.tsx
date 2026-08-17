"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import { toggleUserActive } from "../_actions"
import { showError, showSuccess } from "@/lib/toast-error"

interface Props {
  users: Array<{
    id: string
    email: string
    name: string
    role: string
    isActive: boolean
  }>
}

export function UserList({ users }: Props) {
  const t = useTranslations("users")
  const tr = useTranslations("roles")

  async function handleToggle(userId: string) {
    const result = await toggleUserActive(userId)
    if (result.ok) showSuccess(t("statusUpdated"))
    else showError(result.error)
  }

  if (users.length === 0) return <p className="text-sm text-muted-foreground">{t("noUsers")}</p>

  return (
    <div className="border rounded-lg divide-y">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between px-3 py-2">
          <div>
            <span className="font-medium text-sm">{user.name}</span>
            <span className="ml-2 text-xs text-muted-foreground">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{tr.has(user.role) ? tr(user.role) : user.role}</Badge>
            <Badge variant={user.isActive ? "default" : "destructive"} className="text-xs">
              {user.isActive ? t("active") : t("disabled")}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => handleToggle(user.id)}
            >
              {user.isActive ? t("disable") : t("enable")}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
