import { cookies } from "next/headers"
import { getTranslations } from "next-intl/server"
import { defaultLocale, isLocale, type Locale } from "@/i18n/config"

export async function getActionLocale(): Promise<Locale> {
  const store = await cookies()
  const stored = store.get("locale")?.value
  return stored && isLocale(stored) ? stored : defaultLocale
}

export async function getActionTranslations(namespace: string) {
  const locale = await getActionLocale()
  return getTranslations({ locale, namespace })
}
