"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  async function handleToggle(userId: string) {
    const result = await toggleUserActive(userId)
    if (result.ok) showSuccess("Status updated")
    else showError(result.error)
  }

  if (users.length === 0) return <p className="text-sm text-muted-foreground">No users.</p>

  return (
    <div className="border rounded-lg divide-y">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between px-3 py-2">
          <div>
            <span className="font-medium text-sm">{user.name}</span>
            <span className="ml-2 text-xs text-muted-foreground">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{user.role}</Badge>
            <Badge variant={user.isActive ? "default" : "destructive"} className="text-xs">
              {user.isActive ? "Active" : "Disabled"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => handleToggle(user.id)}
            >
              {user.isActive ? "Disable" : "Enable"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
