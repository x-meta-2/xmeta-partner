import { Lock, LogIn } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { LocalizedLink } from '#/components/common/localized-link';
import { useI18n } from '#/i18n/context';

export const UnauthorizedPage = () => {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-500/10">
        <Lock className="h-12 w-12 text-amber-500" />
      </div>
      <div className="space-y-2">
        <div className="text-5xl font-bold text-amber-500">401</div>
        <h1 className="text-2xl font-bold">
          {t('errors:unauthorized.title', 'Нэвтрэх шаардлагатай')}
        </h1>
        <p className="max-w-md text-muted-foreground">
          {t(
            'errors:unauthorized.description',
            'Та энэ хуудсыг үзэхийн тулд нэвтэрч орох шаардлагатай.',
          )}
        </p>
      </div>
      <Button asChild>
        <LocalizedLink to="/login">
          <LogIn className="mr-2 h-4 w-4" />
          {t('auth:login', 'Нэвтрэх')}
        </LocalizedLink>
      </Button>
    </div>
  );
};
