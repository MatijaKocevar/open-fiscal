"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import { updatePassword } from "../_actions"
import { showError, showSuccess } from "@/lib/toast-error"

export function PasswordForm() {
  const t = useTranslations("account")
  const tc = useTranslations("common")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      showError(t("passwordsDoNotMatch"))
      return
    }
    setLoading(true)
    const result = await updatePassword({ currentPassword, newPassword })
    setLoading(false)
    if (result.ok) {
      showSuccess(t("passwordUpdated"))
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
        placeholder={t("currentPassword")}
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      <Input
        placeholder={t("newPassword")}
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        minLength={6}
      />
      <Input
        placeholder={t("confirmNewPassword")}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        minLength={6}
      />
      <Button type="submit" disabled={loading} size="sm">
        {loading ? tc("saving") : t("changePassword")}
      </Button>
    </form>
  )
}
