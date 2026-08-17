"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"
import { createUser } from "../_actions"
import { showError, showSuccess } from "@/lib/toast-error"

export function UserForm() {
  const t = useTranslations("users")
  const tr = useTranslations("roles")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("CASHIER")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await createUser({ email, password, name, role })
    setLoading(false)
    if (result.ok) {
      showSuccess(t("userCreated"))
      setEmail("")
      setName("")
      setPassword("")
    } else {
      showError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border-t pt-4">
      <h3 className="font-medium text-sm">{t("addUser")}</h3>
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder={t("name")} value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder={t("email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder={t("password")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <Select value={role} onValueChange={(v) => setRole(v ?? "CASHIER")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="OWNER">{tr("OWNER")}</SelectItem>
            <SelectItem value="ADMIN">{tr("ADMIN")}</SelectItem>
            <SelectItem value="CASHIER">{tr("CASHIER")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading} size="sm">
        {loading ? t("creating") : t("createUser")}
      </Button>
    </form>
  )
}
