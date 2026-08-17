"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createUser } from "../_actions"
import { showError, showSuccess } from "@/lib/toast-error"

export function UserForm() {
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
      showSuccess("User created")
      setEmail("")
      setName("")
      setPassword("")
    } else {
      showError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border-t pt-4">
      <h3 className="font-medium text-sm">Add user</h3>
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <Select value={role} onValueChange={(v) => setRole(v ?? "CASHIER")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="OWNER">Owner</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="CASHIER">Cashier</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading} size="sm">
        {loading ? "Creating..." : "Create user"}
      </Button>
    </form>
  )
}
