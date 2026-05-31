"use client";

import { useLocale } from "next-intl";
import { type Locale } from "./config";
import {
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatCurrency,
  formatTokens,
  formatDuration,
} from "./formatting";

export function useFormatting() {
  const locale = useLocale() as Locale;

  return {
    formatDate: (
      date: Date | string | number,
      options?: Intl.DateTimeFormatOptions
    ) => formatDate(date, locale, options),
    formatRelativeTime: (date: Date | string | number) =>
      formatRelativeTime(date, locale),
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(num, locale, options),
    formatCurrency: (amount: number, currency?: string) =>
      formatCurrency(amount, locale, currency),
    formatTokens: (count: number) => formatTokens(count, locale),
    formatDuration: (milliseconds: number) => formatDuration(milliseconds, locale),
  };
}
