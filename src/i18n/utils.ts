export type Locale = 'en' | 'es' | 'ca' | 'nl';

export const locales = ['en', 'es', 'ca', 'nl'] as const satisfies readonly Locale[];

export const defaultLocale: Locale = 'en';

/** Locale codes used in `hreflang` and `<html lang>`. */
export const htmlLang: Record<Locale, string> = {
  en: 'en',
  es: 'es',
  ca: 'ca',
  nl: 'nl',
};

/** Labels for the language switcher. */
export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  ca: 'CA',
  nl: 'NL',
};

/** Full names, used for the switcher's accessible labels. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  ca: 'Català',
  nl: 'Nederlands',
};

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

/**
 * The default locale is served unprefixed, so `/` is English and `/nl/` is Dutch.
 */
export function localisePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === '/' ? `/${locale}/` : `/${locale}${clean}`;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  return isLocale(first) ? first : defaultLocale;
}

export function formatDate(value: string | Date, locale: Locale): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
