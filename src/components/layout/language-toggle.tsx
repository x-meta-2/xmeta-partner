import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Globe } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover';
import { Button } from '#/components/ui/button';
import { cn } from '#/lib/utils';
import { LOCALES, type Locale } from '#/i18n/locales';
import { switchLocalePathname, localeFromPathname } from '#/i18n/routing';

const LABELS: Record<Locale, string> = {
  mn: 'Монгол',
  en: 'English',
};

export function LanguageToggle() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const currentLocale = localeFromPathname(pathname);

  const switchTo = (next: Locale) => {
    if (next === currentLocale) return;
    const nextPath = switchLocalePathname(pathname, next);
    void navigate({ to: nextPath });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 rounded-full px-3"
          aria-label="Change language"
        >
          <Globe className="size-4" />
          <span className="ml-1 text-xs font-medium uppercase">
            {currentLocale}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-36 p-1">
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            className={cn(
              'flex w-full items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-muted',
              l === currentLocale && 'bg-muted font-semibold',
            )}
          >
            <span>{LABELS[l]}</span>
            <span className="text-xs uppercase text-muted-foreground">{l}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
