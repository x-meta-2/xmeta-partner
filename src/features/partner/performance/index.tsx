import { useQuery } from '@tanstack/react-query';
import { BarChart3, DollarSign, UserCheck, Users } from 'lucide-react';
import { PageHeader } from '#/components/common/page-header';
import { Card } from '#/components/ui/card';
import { Skeleton } from '#/components/ui/skeleton';
import { useI18n } from '#/i18n/context';
import {
  getDashboardSummary,
  getTierProgress,
} from '#/services/apis/partner/dashboard';
import { getReferralStats } from '#/services/apis/partner/referrals';
import { getPublicTiers } from '#/services/apis/public';
import { formatCount, formatUSD } from '#/utils';
import {
  formatRate,
  formatVolume,
  formatVolumeRange,
  getTierVideoSrc,
} from '#/utils/tier';
import { TierArtwork } from '#/components/common/tier-artwork';
import type { LucideIcon } from 'lucide-react';

export function PerformanceStatisticsPage() {
  const { t } = useI18n();
  const summaryQuery = useQuery({
    queryKey: ['partner', 'dashboard', 'summary'],
    queryFn: getDashboardSummary,
  });
  const tierQuery = useQuery({
    queryKey: ['partner', 'dashboard', 'tier'],
    queryFn: getTierProgress,
  });
  const refStatsQuery = useQuery({
    queryKey: ['partner', 'referrals', 'stats'],
    queryFn: getReferralStats,
  });
  const tiersQuery = useQuery({
    queryKey: ['public-tiers'],
    queryFn: getPublicTiers,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading =
    summaryQuery.isLoading ||
    tierQuery.isLoading ||
    refStatsQuery.isLoading ||
    tiersQuery.isLoading;

  const summary = summaryQuery.data;
  const tier = tierQuery.data;
  const refStats = refStatsQuery.data;
  const allTiers = [...(tiersQuery.data ?? [])].sort(
    (a, b) => a.level - b.level,
  );

  const currentTier = tier?.currentTier ?? null;
  const activeClients = tier?.activeClients ?? 0;
  const totalVolume = tier?.totalVolume ?? 0;

  const nextTier = (() => {
    if (tier?.nextTier) return tier.nextTier;
    if (!currentTier || allTiers.length === 0) return null;
    return (
      allTiers.find(
        (candidateTier) => candidateTier.level > currentTier.level,
      ) ?? null
    );
  })();

  const maxTier = allTiers.length > 0 ? allTiers[allTiers.length - 1] : null;
  const progressTarget = nextTier ?? maxTier;
  const clientsPct = progressTarget
    ? Math.min((activeClients / progressTarget.minActiveClients) * 100, 100)
    : 100;
  const volPct = progressTarget
    ? Math.min((totalVolume / progressTarget.minVolume) * 100, 100)
    : 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('partner:performance.title')}
        description={t('partner:performance.description')}
      />

      {isLoading ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : (
        <Card className="relative overflow-hidden border-0 bg-slate-900">
          <video
            key={currentTier?.name ?? 'standard'}
            src={getTierVideoSrc(currentTier?.name)}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 size-full object-cover opacity-30"
          />
          <div className="relative flex items-stretch gap-5 p-5">
            <div className="flex shrink-0 items-center gap-3">
              <TierArtwork
                tierName={currentTier?.name}
                className="size-14 rounded-lg"
              />
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  {t('partner:performance.currentTier')}
                </span>
                <div className="text-xl font-bold text-white">
                  {currentTier?.name ?? 'Standard'}
                </div>
                <span className="text-[11px] text-slate-400">
                  {formatRate(currentTier?.commissionRate ?? 0)} Commission
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    Active Clients ({activeClients} /{' '}
                    {progressTarget?.minActiveClients ?? '–'})
                  </span>
                  <span className="font-semibold text-slate-300">
                    {Math.floor(clientsPct)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-violet-400 transition-all"
                    style={{
                      width: `${Math.max(clientsPct, clientsPct > 0 ? 2 : 0)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    Volume ({formatVolume(totalVolume)} /{' '}
                    {progressTarget ? formatVolume(progressTarget.minVolume) : '–'})
                  </span>
                  <span className="font-semibold text-slate-300">
                    {Math.floor(volPct)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                    style={{
                      width: `${Math.max(volPct, volPct > 0 ? 2 : 0)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {nextTier && (
              <div className="flex shrink-0 flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                <span className="text-[10px] text-slate-400">
                  {t('partner:performance.nextTier')}
                </span>
                <TierArtwork
                  tierName={nextTier.name}
                  className="size-12 rounded-lg"
                />
                <span className="text-xs font-medium text-slate-300">
                  {nextTier.name} · {formatRate(nextTier.commissionRate)}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          <MiniStatCard
            label={t('partner:performance.totalReferrals')}
            value={formatCount(refStats?.total ?? 0)}
            icon={Users}
            isLoading={isLoading}
          />
          <MiniStatCard
            label={t('partner:performance.activeClients')}
            value={formatCount(activeClients)}
            icon={UserCheck}
            isLoading={isLoading}
          />
          <MiniStatCard
            label={t('partner:performance.totalVolume')}
            value={formatVolume(totalVolume)}
            icon={BarChart3}
            isLoading={isLoading}
          />
          <MiniStatCard
            label={t('partner:performance.totalCommission')}
            value={formatUSD(summary?.totalEarnings ?? 0)}
            icon={DollarSign}
            isLoading={isLoading}
          />
        </div>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">
            {t('partner:performance.commissionTiers')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2.5 font-medium">
                    {t('partner:performance.col.tier')}
                  </th>
                  <th className="pb-2.5 font-medium">
                    {t('partner:performance.col.commission')}
                  </th>
                  <th className="pb-2.5 font-medium">
                    {t('partner:performance.col.activeClients')}
                  </th>
                  <th className="pb-2.5 font-medium">
                    {t('partner:performance.col.tradingVolume')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2.5">
                          <Skeleton className="h-5 w-20" />
                        </td>
                        <td className="py-2.5">
                          <Skeleton className="h-5 w-12" />
                        </td>
                        <td className="py-2.5">
                          <Skeleton className="h-5 w-14" />
                        </td>
                        <td className="py-2.5">
                          <Skeleton className="h-5 w-28" />
                        </td>
                      </tr>
                    ))
                  : allTiers.map((rowTier) => {
                      const isCurrent = rowTier.name === currentTier?.name;
                      return (
                        <tr
                          key={rowTier.id}
                          className={`border-b last:border-0 ${isCurrent ? 'bg-primary/5' : ''}`}
                        >
                          <td className="py-2.5">
                            <div className="flex items-center gap-2">
                              <TierArtwork
                                tierName={rowTier.name}
                                className="size-7 rounded"
                              />
                              <span
                                className="text-xs font-semibold"
                                style={{ color: rowTier.color || undefined }}
                              >
                                {rowTier.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 text-xs tabular-nums">
                            {formatRate(rowTier.commissionRate)}
                          </td>
                          <td className="py-2.5 text-xs tabular-nums">
                            {'>='} {rowTier.minActiveClients}
                          </td>
                          <td className="py-2.5 text-xs tabular-nums">
                            {formatVolumeRange(
                              rowTier.minVolume,
                              rowTier.maxVolume,
                            )}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MiniStatCard({
  label,
  value,
  icon: Icon,
  isLoading,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  isLoading: boolean;
}) {
  return (
    <Card className="flex flex-col gap-3.5 p-5">
      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <Icon className="size-4" strokeWidth={1.8} />
        {label}
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <span className="text-[1.75rem] font-semibold leading-none tracking-tight">
          {value}
        </span>
      )}
    </Card>
  );
}
