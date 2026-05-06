import { Card } from '#/components/ui/card';
import { Trophy } from 'lucide-react';
import type { TierProgress } from '#/services/apis/partner/dashboard';
import { formatRate, formatVolume } from '#/utils/tier';

export function TierProgressCard({ progress }: { progress: TierProgress }) {
  const clientsPct = Math.min(100, progress.activeClientsProgress * 100);
  const volPct = Math.min(100, progress.volumeProgress * 100);
  const { currentTier, nextTier } = progress;

  return (
    <Card className="gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Current Tier</div>
          <div className="mt-1 flex items-center gap-2">
            <Trophy className="size-5 text-amber-500" />
            <span className="text-xl font-semibold">{currentTier.name}</span>
            <span className="text-sm text-muted-foreground">
              · {formatRate(currentTier.commissionRate)} commission
            </span>
          </div>
        </div>
        {nextTier && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Next</div>
            <div className="text-sm font-medium">
              {nextTier.name} · {formatRate(nextTier.commissionRate)}
            </div>
          </div>
        )}
      </div>

      {nextTier && (
        <>
          <ProgressRow
            label={`Active Clients (${progress.activeClients} / ${nextTier.minActiveClients})`}
            pct={clientsPct}
          />
          <ProgressRow
            label={`Volume (${formatVolume(progress.totalVolume)} / ${formatVolume(nextTier.minVolume)})`}
            pct={volPct}
          />
        </>
      )}
    </Card>
  );
}

function ProgressRow({ label, pct }: { label: string; pct: number }) {
  const display = pct >= 100 ? '100' : pct < 1 && pct > 0 ? '< 1' : String(Math.floor(pct));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{display}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover transition-all"
          style={{ width: `${Math.max(pct, pct > 0 ? 1 : 0)}%` }}
        />
      </div>
    </div>
  );
}
