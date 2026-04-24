import { Card } from '#/components/ui/card';
import { Trophy } from 'lucide-react';
import type { TierProgress } from '#/services';

const vol = (v: number) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
};

export function TierProgressCard({ progress }: { progress: TierProgress }) {
  const clientsPct = Math.min(100, Math.round(progress.activeClientsProgress * 100));
  const volPct = Math.min(100, Math.round(progress.volumeProgress * 100));
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
              · {(currentTier.commissionRate * 100).toFixed(0)}% commission
            </span>
          </div>
        </div>
        {nextTier && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Next</div>
            <div className="text-sm font-medium">
              {nextTier.name} · {(nextTier.commissionRate * 100).toFixed(0)}%
            </div>
          </div>
        )}
      </div>

      {nextTier && (
        <>
          <ProgressRow
            label={`Active Clients (${progress.activeClients} / ${nextTier.minReferrals})`}
            pct={clientsPct}
          />
          <ProgressRow
            label={`Volume (${vol(progress.totalVolume)} / ${vol(nextTier.minVolume)})`}
            pct={volPct}
          />
        </>
      )}
    </Card>
  );
}

function ProgressRow({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
