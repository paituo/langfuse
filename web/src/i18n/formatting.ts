import { type Locale } from "./config";

export function formatDate(
  date: Date | string | number,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

export function formatRelativeTime(
  date: Date | string | number,
  locale: Locale
): string {
  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - dateObj.getTime()) / 1000
  );

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second");
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
  }
}

export function formatNumber(
  num: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(num);
}

export function formatCurrency(
  amount: number,
  locale: Locale,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatTokens(count: number, locale: Locale): string {
  if (count >= 1000000) {
    return `${formatNumber(count / 1000000, locale, {
      maximumFractionDigits: 1,
    })}M`;
  } else if (count >= 1000) {
    return `${formatNumber(count / 1000, locale, {
      maximumFractionDigits: 1,
    })}K`;
  }
  return formatNumber(count, locale);
}

export function formatDuration(milliseconds: number, locale: Locale): string {
  if (milliseconds < 1000) {
    return `${formatNumber(milliseconds, locale)}ms`;
  }

  const seconds = milliseconds / 1000;
  if (seconds < 60) {
    return `${formatNumber(seconds, locale, {
      maximumFractionDigits: 2,
    })}s`;
  }

  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${formatNumber(minutes, locale, {
      maximumFractionDigits: 1,
    })}m`;
  }

  const hours = minutes / 60;
  return `${formatNumber(hours, locale, { maximumFractionDigits: 1 })}h`;
}
