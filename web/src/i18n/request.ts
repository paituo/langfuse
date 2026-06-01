import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./config";
import type { Locale } from "./config";

const messageImports: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import("../../messages/en.json"),
  "zh-CN": () => import("../../messages/zh-CN.json"),
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  const messages = messageImports[locale]
    ? (await messageImports[locale]()).default
    : (await messageImports[defaultLocale]()).default;

  return {
    locale,
    messages,
  };
});
