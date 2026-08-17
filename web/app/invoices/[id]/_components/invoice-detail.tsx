"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import { resendReceipt } from "@/app/invoices/_actions"
import { showError, showSuccess } from "@/lib/toast-error"
import { useState } from "react"

export function ResendButton({ invoiceId }: { invoiceId: string }) {
  const t = useTranslations("invoices")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleResend() {
    if (!email) {
      showError(t("enterEmail"))
      return
    }
    setLoading(true)
    const result = await resendReceipt(invoiceId, email)
    setLoading(false)
    if (result.ok) showSuccess(t("invoiceSent"))
    else showError(result.error)
  }

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <label className="text-sm text-muted-foreground">{t("sendToEmail")}</label>
        <Input
          type="email"
          placeholder="customer@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button onClick={handleResend} disabled={loading}>
        {loading ? t("sending") : t("send")}
      </Button>
    </div>
  )
}
