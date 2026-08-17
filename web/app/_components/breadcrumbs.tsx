"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const SEGMENT_KEYS: Record<string, string> = {
  pos: "pos",
  invoices: "invoices",
  products: "products",
  customers: "customers",
  schedule: "schedule",
  reports: "reports",
  admin: "settings",
  new: "new",
  edit: "edit",
}

export function Breadcrumbs() {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  function labelFor(segment: string): string {
    const key = SEGMENT_KEYS[segment]
    if (key) return t(key)
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {segments.length === 0 ? (
            <BreadcrumbPage>{t("dashboard")}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink render={<Link href="/" />}>{t("dashboard")}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {segments.map((segment, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/")
          const isLast = i === segments.length - 1
          return (
            <Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{labelFor(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={href} />}>
                    {labelFor(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
