import { useRouter } from '@tanstack/react-router';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { LocalizedLink } from '#/components/common/localized-link';
import { useI18n } from '#/i18n/context';

export const ForbiddenPage = () => {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
        <ShieldAlert className="h-12 w-12 text-red-500" />
      </div>
      <div className="space-y-2">
        <div className="text-5xl font-bold text-red-500">403</div>
        <h1 className="text-2xl font-bold">
          {t('errors:forbidden.title', 'Хандах эрхгүй')}
        </h1>
        <p className="max-w-md text-muted-foreground">
          {t(
            'errors:forbidden.description',
            'Танд энэ хуудсыг үзэх эрх байхгүй байна.',
          )}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={() => router.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common:back', 'Буцах')}
        </Button>
        <Button asChild>
          <LocalizedLink to="/">
            {t('common:home', 'Нүүр хуудас')}
          </LocalizedLink>
        </Button>
      </div>
    </div>
  );
};
