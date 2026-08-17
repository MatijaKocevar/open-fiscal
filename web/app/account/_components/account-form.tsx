"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import { updateAccount } from "../_actions"
import { showError, showSuccess } from "@/lib/toast-error"

export function AccountForm({ name, email }: { name: string; email: string }) {
  const t = useTranslations("account")
  const tc = useTranslations("common")
  const [nameValue, setNameValue] = useState(name)
  const [emailValue, setEmailValue] = useState(email)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await updateAccount({ name: nameValue, email: emailValue })
    setLoading(false)
    if (result.ok) showSuccess(t("accountUpdated"))
    else showError(result.error)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        placeholder={t("name")}
        value={nameValue}
        onChange={(e) => setNameValue(e.target.value)}
        required
      />
      <Input
        placeholder={t("email")}
        type="email"
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading} size="sm">
        {loading ? tc("saving") : t("saveChanges")}
      </Button>
    </form>
  )
}
