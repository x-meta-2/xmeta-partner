import React, { createContext, useContext, useMemo } from 'react';
import type { Locale } from './locales';
import { createTranslator } from './messages';

type TranslationValues = Record<string, string | number>;

type I18nContextValue = {
  locale: Locale;
  t: (key: string, defaultValue?: string, values?: TranslationValues) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

type Props = Readonly<{
  locale: Locale;
  children: React.ReactNode;
}>;

export function I18nProvider({ locale, children }: Props) {
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: createTranslator(locale),
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
