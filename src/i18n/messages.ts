import type { Locale } from './locales';
import { enTranslations } from './en-translations';
import { mnTranslations } from './mn-translations';

type Messages = Record<string, string>;
type TranslationValues = Record<string, string | number>;

type Namespaces = {
  common: Messages;
  nav: Messages;
  auth: Messages;
  home: Messages;
  dashboard: Messages;
  security: Messages;
};

export type I18nMessages = Record<Locale, Namespaces>;

export const messages: I18nMessages = {
  mn: mnTranslations,
  en: enTranslations,
};

export function createTranslator(locale: Locale) {
  const localeMessages = messages[locale] ?? messages.mn;

  return function t(
    key: string,
    defaultValue?: string,
    values?: TranslationValues,
  ): string {
    const [ns, name] = key.split(':');
    if (!ns || !name) {
      return defaultValue ?? key;
    }

    const namespace = (localeMessages as Record<string, Messages>)[ns];
    if (!namespace) return defaultValue ?? key;

    const template = namespace[name] ?? defaultValue ?? key;

    if (!values) return template;

    return template.replace(/\{\{(\w+)\}\}/g, (_, token: string) => {
      const value = values[token];
      return value === undefined ? `{{${token}}}` : String(value);
    });
  };
}
