import { ArrowUpRight } from 'lucide-react';
import { Card } from '#/components/ui/card';
import type { Commission } from '#/services/apis/partner/commissions';

const money = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

/**
 * Locale-stable `YYYY-MM-DD HH:mm` (UTC) — avoids SSR hydration mismatches
 * caused by `toLocaleString` reading the browser's timezone/locale.
 */
function formatTime(iso: string) {
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)}`;
}

function describe(c: Commission) {
  if (c.type === 'override') return 'Sub-affiliate override';
  return `${c.type.charAt(0).toUpperCase()}${c.type.slice(1)} trading commission`;
}

export function RecentActivity({ items }: { items: Commission[] }) {
  return (
    <Card className="gap-0 p-0">
      <div className="border-b p-5">
        <div className="text-base font-medium">Recent Activity</div>
        <div className="text-xs text-muted-foreground">
          Latest commission events
        </div>
      </div>
      {items.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No recent activity.
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
                  {describe(c)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTime(c.createdAt)}
                </div>
              </div>
              <div className="shrink-0 text-sm font-semibold text-primary">
                +{money(c.amount)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
