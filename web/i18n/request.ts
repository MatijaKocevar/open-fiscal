import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"
import { defaultLocale, isLocale } from "./config"

export default getRequestConfig(async () => {
  const store = await cookies()
  const stored = store.get("locale")?.value
  const locale = stored && isLocale(stored) ? stored : defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
