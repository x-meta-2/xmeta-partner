import { DEFAULT_LOCALE, parseLocale, type Locale } from './locales';

function splitPathname(pathname: string) {
  const clean = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  const [first, ...rest] = clean.split('/');
  return { first: first ?? '', rest };
}

export function localeFromPathname(pathname: string): Locale {
  const { first } = splitPathname(pathname);
  return parseLocale(first);
}

export function stripLocalePrefix(pathname: string): string {
  const { first, rest } = splitPathname(pathname);
  const locale = parseLocale(first);

  if (first !== locale)
    return pathname.startsWith('/') ? pathname : `/${pathname}`;

  const remaining = `/${rest.join('/')}`.replace(/\/+$/, '');
  return remaining === '' ? '/' : remaining;
}

export function withLocalePrefix(pathname: string, locale: Locale): string {
  const base = stripLocalePrefix(pathname);
  const normalized = base.startsWith('/') ? base : `/${base}`;
  return `/${locale}${normalized === '/' ? '' : normalized}`;
}

export function switchLocalePathname(
  pathname: string,
  nextLocale: Locale,
): string {
  return withLocalePrefix(pathname, nextLocale);
}

export function ensureLocalePrefixed(pathname: string): string {
  const { first } = splitPathname(pathname);
  const locale = parseLocale(first);
  if (first === locale)
    return pathname.startsWith('/') ? pathname : `/${pathname}`;
  return withLocalePrefix(pathname, DEFAULT_LOCALE);
}
