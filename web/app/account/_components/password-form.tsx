"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updatePassword } from "../_actions"
import { showError, showSuccess } from "@/lib/toast-error"

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      showError("Passwords do not match")
      return
    }
    setLoading(true)
    const result = await updatePassword({ currentPassword, newPassword })
    setLoading(false)
    if (result.ok) {
      showSuccess("Password updated")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      showError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        placeholder="Current password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      <Input
        placeholder="New password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        minLength={6}
      />
      <Input
        placeholder="Confirm new password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        minLength={6}
      />
      <Button type="submit" disabled={loading} size="sm">
        {loading ? "Saving..." : "Change password"}
      </Button>
    </form>
  )
}
