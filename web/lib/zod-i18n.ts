import type { ZodType } from "zod"
import { getActionTranslations } from "@/lib/i18n"

export async function safeParseLocalized<S extends ZodType>(
  schema: S,
  namespace: string,
  data: unknown
): Promise<ReturnType<S["safeParse"]>> {
  const t = await getActionTranslations(`validation.${namespace}`)
  const tDefault = await getActionTranslations("validation")

  return schema.safeParse(data, {
    error: (issue: { path?: PropertyKey[] }) => {
      const field = (issue.path ?? []).join(".")
      return t.has(field) ? t(field) : tDefault("default")
    },
  }) as ReturnType<S["safeParse"]>
}
