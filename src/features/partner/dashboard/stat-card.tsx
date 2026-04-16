import { Card } from '#/components/ui/card';
import { cn } from '#/lib/utils';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: number;
  icon: LucideIcon;
  hint?: string;
}

export function StatCard({ label, value, trend, icon: Icon, hint }: StatCardProps) {
  const isUp = (trend ?? 0) >= 0;
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex size-9 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon className="size-4.5" strokeWidth={1.8} />
        </div>
      </div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="flex items-center gap-2 text-xs">
        {trend !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium',
              isUp
                ? 'bg-success-soft text-success'
                : 'bg-destructive-soft text-destructive',
            )}
          >
            {isUp ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </Card>
  );
}
