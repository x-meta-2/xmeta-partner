import { useRouter } from '@tanstack/react-router';
import { ArrowLeft, Home } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { LocalizedLink } from '#/components/common/localized-link';
import { useI18n } from '#/i18n/context';

export const NotFoundPage = () => {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-[120px] font-bold leading-none bg-gradient-to-br from-primary to-primary/40 bg-clip-text text-transparent">
        404
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          {t('errors:notFound.title', 'Хуудас олдсонгүй')}
        </h1>
        <p className="max-w-md text-muted-foreground">
          {t(
            'errors:notFound.description',
            'Таны хайсан хуудас байхгүй эсвэл зөөгдсөн байна.',
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
            <Home className="mr-2 h-4 w-4" />
            {t('common:home', 'Нүүр хуудас')}
          </LocalizedLink>
        </Button>
      </div>
    </div>
  );
};
