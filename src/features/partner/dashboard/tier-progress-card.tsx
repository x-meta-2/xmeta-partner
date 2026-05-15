import { Card } from '#/components/ui/card';
import { useI18n } from '#/i18n/context';
import type { TierProgress } from '#/services/apis/partner/dashboard';
import { formatRate, formatVolume } from '#/utils/tier';
import { TierArtwork } from '#/components/common/tier-artwork';

export function TierProgressCard({ progress }: { progress: TierProgress }) {
  const { t } = useI18n();
  const clientsPct = Math.min(100, progress.activeClientsProgress * 100);
  const volPct = Math.min(100, progress.volumeProgress * 100);
  const { currentTier, nextTier } = progress;

  return (
    <Card className="gap-5 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <TierArtwork
            tierName={currentTier.name}
            className="size-14 rounded-xl"
          />
          <div>
            <div className="text-sm text-muted-foreground">
              {t('partner:dashboard.tier.title')}
            </div>
            <div className="mt-1 text-xl font-semibold">{currentTier.name}</div>
            <div className="text-sm text-muted-foreground">
              {formatRate(currentTier.commissionRate)}{' '}
              {t('partner:dashboard.tier.rate')}
            </div>
          </div>
        </div>
        {nextTier && (
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 sm:text-right">
            <TierArtwork
              tierName={nextTier.name}
              className="size-11 rounded-lg"
            />
            <div>
              <div className="text-xs text-muted-foreground">
                {t('partner:performance.nextTier')}
              </div>
              <div className="text-sm font-medium">
                {nextTier.name} · {formatRate(nextTier.commissionRate)}
              </div>
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
  const display =
    pct >= 100 ? '100' : pct < 1 && pct > 0 ? '< 1' : String(Math.floor(pct));
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
