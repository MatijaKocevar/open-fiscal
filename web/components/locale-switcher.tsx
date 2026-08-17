"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { locales, type Locale } from "@/i18n/config"
import { setLocale } from "@/app/_actions"

export function LocaleSwitcher() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("localeSwitcher")
  const [isPending, startTransition] = useTransition()

  function onChange(next: string) {
    startTransition(() => {
      setLocale(next as Locale)
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-7"
            aria-label={t("label")}
          />
        }
      >
        <Languages className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => onChange(l)}
            disabled={l === locale || isPending}
          >
            {t("locale", { locale: l })}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
