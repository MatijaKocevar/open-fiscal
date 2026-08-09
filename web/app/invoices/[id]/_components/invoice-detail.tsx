"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { resendReceipt } from "@/app/invoices/_actions"
import { showError, showSuccess } from "@/lib/toast-error"
import { useState } from "react"

export function ResendButton({ invoiceId }: { invoiceId: string }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleResend() {
    if (!email) {
      showError("Vnesite email naslov")
      return
    }
    setLoading(true)
    const result = await resendReceipt(invoiceId, email)
    setLoading(false)
    if (result.ok) showSuccess("Račun poslan!")
    else showError(result.error)
  }

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <label className="text-sm text-muted-foreground">Pošlji račun na email</label>
        <Input
          type="email"
          placeholder="stranka@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button onClick={handleResend} disabled={loading}>
        {loading ? "Pošiljam..." : "Pošlji"}
      </Button>
    </div>
  )
}
