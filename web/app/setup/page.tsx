"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { completeSetup } from "./_actions"
import { showError } from "@/lib/toast-error"
import { useRouter } from "next/navigation"

const STEPS = ["Welcome", "Company", "SMTP", "Certificates", "Premise", "Complete"]

export default function SetupPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Record<string, string>>({})
  const router = useRouter()

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
            Step {step + 1}/{STEPS.length}: {STEPS[step]}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold">Welcome to OpenFiscal</h2>
              <p className="text-muted-foreground">
                Set up your company, tax data, SMTP for sending invoices, and FURS connection.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <Input placeholder="Company name *" value={data.name || ""} onChange={(e) => update("name", e.target.value)} />
              <Input placeholder="Tax number" value={data.taxNumber || ""} onChange={(e) => update("taxNumber", e.target.value)} />
              <Input placeholder="VAT ID" value={data.vatId || ""} onChange={(e) => update("vatId", e.target.value)} />
              <Input placeholder="Address *" value={data.address || ""} onChange={(e) => update("address", e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="City *" value={data.city || ""} onChange={(e) => update("city", e.target.value)} />
                <Input placeholder="Postal code *" value={data.postalCode || ""} onChange={(e) => update("postalCode", e.target.value)} />
              </div>
              <Input placeholder="Phone" value={data.phone || ""} onChange={(e) => update("phone", e.target.value)} />
              <Input placeholder="Email" value={data.email || ""} onChange={(e) => update("email", e.target.value)} />
              <Input placeholder="IBAN" value={data.iban || ""} onChange={(e) => update("iban", e.target.value)} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Input placeholder="SMTP host *" value={data.smtp_host || ""} onChange={(e) => update("smtp_host", e.target.value)} />
              <Input placeholder="SMTP port *" value={data.smtp_port || "587"} onChange={(e) => update("smtp_port", e.target.value)} />
              <Input placeholder="SMTP user *" value={data.smtp_user || ""} onChange={(e) => update("smtp_user", e.target.value)} />
              <Input placeholder="SMTP password" type="password" value={data.smtp_pass || ""} onChange={(e) => update("smtp_pass", e.target.value)} />
              <Input placeholder="Sender email *" value={data.smtp_from || ""} onChange={(e) => update("smtp_from", e.target.value)} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Copy files to folder <code>certs/</code> (app-cert.pfx, server-cert.cer, intermediate-ca.cer, root-ca.cer)
              </p>
              <Input placeholder="PFX password" type="password" value={data.certPassword || ""} onChange={(e) => update("certPassword", e.target.value)} />
              <p className="text-xs text-muted-foreground">For test environment leave empty — mock mode is used.</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <Input placeholder="Business premise ID (FURS)" value={data.premiseId || ""} onChange={(e) => update("premiseId", e.target.value)} />
              <Input placeholder="Premise name" value={data.premiseName || ""} onChange={(e) => update("premiseName", e.target.value)} />
              <Input placeholder="Premise address" value={data.premiseAddress || ""} onChange={(e) => update("premiseAddress", e.target.value)} />
              <Input placeholder="Premise city" value={data.premiseCity || ""} onChange={(e) => update("premiseCity", e.target.value)} />
              <Input placeholder="Device ID (FURS)" value={data.deviceId || ""} onChange={(e) => update("deviceId", e.target.value)} />
              <Input placeholder="Device name" value={data.deviceName || ""} onChange={(e) => update("deviceName", e.target.value)} />
            </div>
          )}

          {step === 5 && (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold">All ready!</h2>
              <p className="text-muted-foreground">
                Company <strong>{data.name}</strong> is set up.
                Premise: {data.premiseName}, Device: {data.deviceName}.
              </p>
              <p className="text-sm text-muted-foreground">
                Save settings and continue to login.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Back
            </Button>
            {step < 5 ? (
              <Button onClick={() => setStep((s) => s + 1)}>Next</Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? "Saving..." : "Save and finish"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
