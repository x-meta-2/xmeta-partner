import { Card } from '#/components/ui/card';
import { Trophy } from 'lucide-react';
import type { TierProgress } from '#/services/types/partner.types';

export function TierProgressCard({ progress }: { progress: TierProgress }) {
  const refPct = Math.min(100, Math.round(progress.referralProgress * 100));
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
              · {currentTier.commissionRate}% commission
            </span>
          </div>
        </div>
        {nextTier && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Next</div>
            <div className="text-sm font-medium">
              {nextTier.name} · {nextTier.commissionRate}%
            </div>
          </div>
        )}
      </div>

      {nextTier && (
        <>
          <ProgressRow
            label={`Referrals (${progress.referralCount} / ${nextTier.minReferrals})`}
            pct={refPct}
          />
          <ProgressRow
            label={`Volume ($${progress.totalVolume.toLocaleString('en-US')} / $${nextTier.minVolume.toLocaleString('en-US')})`}
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
