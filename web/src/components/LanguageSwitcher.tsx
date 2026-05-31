"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale } from "@/src/i18n/config";
import { Globe } from "lucide-react";

const localeNames: Record<Locale, string> = {
  en: "English",
  "zh-CN": "中文",
};

export function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="relative inline-block">
      <label
        htmlFor="language-select"
        className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <Globe className="h-4 w-4" />
        <span>{t("switchLanguage")}</span>
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value as Locale)}
        className="absolute h-0 w-0 opacity-0"
        aria-label={t("title")}
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
      <div
        className="ml-6 cursor-pointer"
        onClick={() => document.getElementById("language-select")?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            document.getElementById("language-select")?.click();
          }
        }}
      >
        <span className="text-sm font-medium">{localeNames[locale]}</span>
      </div>
    </div>
  );
}
