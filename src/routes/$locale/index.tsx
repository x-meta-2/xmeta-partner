import { createFileRoute, redirect } from '@tanstack/react-router';
import { LandingPage } from '#/features/landing';
import { isLocale, DEFAULT_LOCALE } from '#/i18n/locales';

export const Route = createFileRoute('/$locale/')({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) {
      throw redirect({
        to: '/$locale',
        params: { locale: DEFAULT_LOCALE },
        replace: true,
      });
    }
  },
  component: LandingPage,
});
