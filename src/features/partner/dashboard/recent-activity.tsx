import { ArrowUpRight } from 'lucide-react';
import { Card } from '#/components/ui/card';
import { useI18n } from '#/i18n/context';
import type { Commission } from '#/services/apis/partner/commissions';
import { formatUSD } from '#/utils';

/**
 * Locale-stable `YYYY-MM-DD HH:mm` (UTC) — avoids SSR hydration mismatches
 * caused by `toLocaleString` reading the browser's timezone/locale.
 */
function formatTime(iso: string) {
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)}`;
}

export function RecentActivity({ items }: { items: Commission[] }) {
  const { t } = useI18n();
  return (
    <Card className="gap-0 p-0">
      <div className="border-b p-5">
        <div className="text-base font-medium">{t('partner:dashboard.activity.title')}</div>
        <div className="text-xs text-muted-foreground">
          {t('partner:dashboard.activity.description')}
        </div>
      </div>
      {items.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          {t('partner:dashboard.activity.empty')}
        </div>
      ) : (
        <ul className="divide-y">
          {items.map((c) => (
            <li key={c.id} className="flex items-start gap-3 p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <ArrowUpRight className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                  {t('partner:dashboard.activity.commission')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTime(c.createdAt)}
                </div>
              </div>
              <div className="shrink-0 text-sm font-semibold text-primary">
                +{formatUSD(c.rebateAmount)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
