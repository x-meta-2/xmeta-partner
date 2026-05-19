import { Card } from '#/components/ui/card';
import { useI18n } from '#/i18n/context';
import type { TierProgress } from '#/services/apis/partner/dashboard';
import { formatRate, formatVolume, getTierVideoSrc } from '#/utils/tier';
import { TierArtwork } from '#/components/common/tier-artwork';

export function TierProgressCard({ progress }: { progress: TierProgress }) {
  const { t } = useI18n();
  const clientsPct = Math.min(100, progress.activeClientsProgress * 100);
  const volPct = Math.min(100, progress.volumeProgress * 100);
  const { currentTier, nextTier } = progress;

  return (
    <Card className="relative overflow-hidden border-0 bg-slate-900">
      <video
        key={currentTier.name}
        src={getTierVideoSrc(currentTier.name)}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 size-full object-cover opacity-30"
      />
      <div className="relative flex items-stretch gap-4 p-5">
        <div className="flex shrink-0 items-center gap-3">
          <TierArtwork
            tierName={currentTier.name}
            className="size-12 rounded-lg"
          />
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              {t('partner:dashboard.tier.title')}
            </span>
            <div className="text-lg font-bold text-white">
              {currentTier.name}
            </div>
            <span className="text-[11px] text-slate-400">
              {formatRate(currentTier.commissionRate)}{' '}
              {t('partner:dashboard.tier.rate')}
            </span>
          </div>
        </div>

        {nextTier && (
          <div className="flex flex-1 flex-col justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <ProgressRow
              label={`Active Clients (${progress.activeClients} / ${nextTier.minActiveClients})`}
              pct={clientsPct}
              color="from-primary to-violet-400"
            />
            <ProgressRow
              label={`Volume (${formatVolume(progress.totalVolume)} / ${formatVolume(nextTier.minVolume)})`}
              pct={volPct}
              color="from-emerald-500 to-emerald-400"
            />
          </div>
        )}

        {nextTier && (
          <div className="flex shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <span className="text-[10px] text-slate-400">
              {t('partner:performance.nextTier')}
            </span>
            <TierArtwork
              tierName={nextTier.name}
              className="size-10 rounded-lg"
            />
            <span className="text-xs font-medium text-slate-300">
              {nextTier.name} · {formatRate(nextTier.commissionRate)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

function ProgressRow({
  label,
  pct,
  color,
}: {
  label: string;
  pct: number;
  color: string;
}) {
  const display =
    pct >= 100 ? '100' : pct < 1 && pct > 0 ? '< 1' : String(Math.floor(pct));
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold text-slate-300">{display}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all`}
          style={{ width: `${Math.max(pct, pct > 0 ? 1 : 0)}%` }}
        />
      </div>
    </div>
  );
}
