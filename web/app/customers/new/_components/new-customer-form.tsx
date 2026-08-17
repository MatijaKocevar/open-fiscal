"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import { createCustomer } from "@/app/customers/_actions"
import { showError, showSuccess } from "@/lib/toast-error"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function NewCustomerForm() {
  const t = useTranslations("customers")
  const tc = useTranslations("common")
  const router = useRouter()
  const [name, setName] = useState("")
  const [vatId, setVatId] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    const result = await createCustomer({
      name,
      vatId: vatId || undefined,
      address: address || undefined,
      city: city || undefined,
      postalCode: postalCode || undefined,
      phone: phone || undefined,
      email: email || undefined,
    })
    setLoading(false)
    if (!result.ok) {
      showError(result.error)
    } else {
      showSuccess(t("customerCreated"))
      router.push("/customers")
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("nameRequired")}</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Janez Novak" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("taxNumber")}</label>
        <Input value={vatId} onChange={(e) => setVatId(e.target.value)} placeholder="11111111" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("address")}</label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("city")}</label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("postalCode")}</label>
          <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("phone")}</label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("email")}</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? tc("saving") : tc("save")}
        </Button>
      </div>
    </div>
  )
}
