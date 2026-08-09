"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateCustomer, deleteCustomer } from "@/app/customers/_actions"
import { showError, showSuccess } from "@/lib/toast-error"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Props {
  customer: { id: string; name: string; vatId: string; address: string; city: string; postalCode: string; phone: string; email: string }
}

export function CustomerForm({ customer }: Props) {
  const router = useRouter()
  const [name, setName] = useState(customer.name)
  const [vatId, setVatId] = useState(customer.vatId)
  const [address, setAddress] = useState(customer.address)
  const [city, setCity] = useState(customer.city)
  const [postalCode, setPostalCode] = useState(customer.postalCode)
  const [phone, setPhone] = useState(customer.phone)
  const [email, setEmail] = useState(customer.email)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSave() {
    setLoading(true)
    const result = await updateCustomer(customer.id, {
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
      showSuccess("Customer updated")
      router.push("/customers")
    }
  }

  async function handleDelete() {
    if (!confirm("Delete customer?")) return
    setDeleting(true)
    const result = await deleteCustomer(customer.id)
    setDeleting(false)
    if (result.ok) {
      showSuccess("Customer deleted")
      router.push("/customers")
    } else {
      showError(result.error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name *</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Tax number</label>
        <Input value={vatId} onChange={(e) => setVatId(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Address</label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Postal code</label>
          <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone</label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="flex justify-between pt-2">
        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete"}
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  )
}
