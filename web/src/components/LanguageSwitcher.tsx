import { useRouter } from "next/router";
import { useTransition } from "react";
import { locales, type Locale } from "@/src/i18n/config";
import { Globe } from "lucide-react";

const localeNames: Record<Locale, string> = {
  en: "English",
  "zh-CN": "中文（简体）",
};

export function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale(newLocale: Locale) {
    if (router.locale === newLocale) return;

    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;

    startTransition(() => {
      router.push(router.asPath, router.asPath, { locale: newLocale });
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <select
        value={router.locale ?? "en"}
        onChange={(e) => switchLocale(e.target.value as Locale)}
        disabled={isPending}
        className="bg-background text-foreground h-7 rounded-md border px-2 text-sm outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeNames[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
