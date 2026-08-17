"use server"

import { cookies } from "next/headers"
import { isLocale, type Locale } from "@/i18n/config"

export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return
  ;(await cookies()).set("locale", locale)
}
