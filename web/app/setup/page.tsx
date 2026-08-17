"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { completeSetup } from "./_actions"
import { showError } from "@/lib/toast-error"

const STEP_KEYS = ["welcome", "company", "smtp", "certificates", "premise", "complete"] as const

export default function SetupPage() {
  const t = useTranslations("setup")
  const tc = useTranslations("common")
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Record<string, string>>({})

  const steps = STEP_KEYS.map((key) => t(`steps.${key}`))

  function update(key: string, value: string) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  async function handleComplete() {
    setLoading(true)
    const result = await completeSetup(data)
    setLoading(false)
    if (!result) return
    if ("error" in result) {
      showError(result.error)
    }
  }

  return (
    <div className="max-w-lg mx-auto pt-12">
      <Card>
        <CardHeader>
          <CardTitle>
            {t("step", { current: step + 1, total: steps.length, name: steps[step] })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold">{t("welcomeTitle")}</h2>
              <p className="text-muted-foreground">{t("welcomeDescription")}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <Input placeholder={t("companyName")} value={data.name || ""} onChange={(e) => update("name", e.target.value)} />
              <Input placeholder={t("taxNumber")} value={data.taxNumber || ""} onChange={(e) => update("taxNumber", e.target.value)} />
              <Input placeholder={t("vatId")} value={data.vatId || ""} onChange={(e) => update("vatId", e.target.value)} />
              <Input placeholder={t("address")} value={data.address || ""} onChange={(e) => update("address", e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder={t("city")} value={data.city || ""} onChange={(e) => update("city", e.target.value)} />
                <Input placeholder={t("postalCode")} value={data.postalCode || ""} onChange={(e) => update("postalCode", e.target.value)} />
              </div>
              <Input placeholder={t("phone")} value={data.phone || ""} onChange={(e) => update("phone", e.target.value)} />
              <Input placeholder={t("email")} value={data.email || ""} onChange={(e) => update("email", e.target.value)} />
              <Input placeholder={t("iban")} value={data.iban || ""} onChange={(e) => update("iban", e.target.value)} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Input placeholder={t("smtpHost")} value={data.smtp_host || ""} onChange={(e) => update("smtp_host", e.target.value)} />
              <Input placeholder={t("smtpPort")} value={data.smtp_port || "587"} onChange={(e) => update("smtp_port", e.target.value)} />
              <Input placeholder={t("smtpUser")} value={data.smtp_user || ""} onChange={(e) => update("smtp_user", e.target.value)} />
              <Input placeholder={t("smtpPassword")} type="password" value={data.smtp_pass || ""} onChange={(e) => update("smtp_pass", e.target.value)} />
              <Input placeholder={t("senderEmail")} value={data.smtp_from || ""} onChange={(e) => update("smtp_from", e.target.value)} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {t.rich("certDescription", {
                  code: (chunks) => <code>{chunks}</code>,
                })}
              </p>
              <Input placeholder={t("pfxPassword")} type="password" value={data.certPassword || ""} onChange={(e) => update("certPassword", e.target.value)} />
              <p className="text-xs text-muted-foreground">{t("certMockNote")}</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <Input placeholder={t("premiseId")} value={data.premiseId || ""} onChange={(e) => update("premiseId", e.target.value)} />
              <Input placeholder={t("premiseName")} value={data.premiseName || ""} onChange={(e) => update("premiseName", e.target.value)} />
              <Input placeholder={t("premiseAddress")} value={data.premiseAddress || ""} onChange={(e) => update("premiseAddress", e.target.value)} />
              <Input placeholder={t("premiseCity")} value={data.premiseCity || ""} onChange={(e) => update("premiseCity", e.target.value)} />
              <Input placeholder={t("deviceId")} value={data.deviceId || ""} onChange={(e) => update("deviceId", e.target.value)} />
              <Input placeholder={t("deviceName")} value={data.deviceName || ""} onChange={(e) => update("deviceName", e.target.value)} />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-bold">{t("allReady")}</h2>
                <p className="text-muted-foreground">
                  {t("allReadyDescription", {
                    name: data.name,
                    premise: data.premiseName,
                    device: data.deviceName,
                  })}
                </p>
                <p className="text-sm text-muted-foreground">{t("createAdmin")}</p>
              </div>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder={t("adminEmail")}
                  value={data.adminEmail || ""}
                  onChange={(e) => update("adminEmail", e.target.value)}
                />
                <Input
                  type="password"
                  placeholder={t("adminPassword")}
                  value={data.adminPassword || ""}
                  onChange={(e) => update("adminPassword", e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              {tc("back")}
            </Button>
            {step < 5 ? (
              <Button onClick={() => setStep((s) => s + 1)}>{tc("next")}</Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? tc("saving") : t("saveAndFinish")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
