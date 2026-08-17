"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateAccount } from "../_actions"
import { showError, showSuccess } from "@/lib/toast-error"

export function AccountForm({ name, email }: { name: string; email: string }) {
  const [nameValue, setNameValue] = useState(name)
  const [emailValue, setEmailValue] = useState(email)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await updateAccount({ name: nameValue, email: emailValue })
    setLoading(false)
    if (result.ok) showSuccess("Account updated")
    else showError(result.error)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        placeholder="Name"
        value={nameValue}
        onChange={(e) => setNameValue(e.target.value)}
        required
      />
      <Input
        placeholder="Email"
        type="email"
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading} size="sm">
        {loading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  )
}
