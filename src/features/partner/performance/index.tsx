import { useQuery } from '@tanstack/react-query';
import { Award, BarChart3, DollarSign, UserCheck, Users } from 'lucide-react';

import { PageHeader } from '#/components/common/page-header';
import { Badge } from '#/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Skeleton } from '#/components/ui/skeleton';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import {
  getDashboardSummary,
  getTierProgress,
} from '#/services/apis/partner/dashboard';
import { getReferralStats } from '#/services/apis/partner/referrals';
import { getPublicTiers } from '#/services/apis/public';
import { formatCount, formatUSD } from '#/utils';
import { formatRate, formatVolume, formatVolumeRange } from '#/utils/tier';

export function PerformanceStatisticsPage() {
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
    return allTiers.find((t) => t.level > currentTier.level) ?? null;
  })();

  const clientsPct = nextTier
    ? Math.min((activeClients / nextTier.minActiveClients) * 100, 100)
    : 100;

  const volPct = nextTier
    ? Math.min((totalVolume / nextTier.minVolume) * 100, 100)
    : 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Statistics"
        description="Track your referral performance and tier progress"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Referrals"
          value={formatCount(refStats?.total ?? 0)}
          icon={Users}
          isLoading={isLoading}
        />
        <StatCard
          label="Active Clients"
          value={formatCount(activeClients)}
          icon={UserCheck}
          hint="Futures trade in last 120 days"
          isLoading={isLoading}
        />
        <StatCard
          label="Total Volume"
          value={formatVolume(totalVolume)}
          icon={BarChart3}
          isLoading={isLoading}
        />
        <StatCard
          label="Total Commission"
          value={formatUSD(summary?.totalEarnings ?? 0)}
          icon={DollarSign}
          isLoading={isLoading}
        />
      </div>

      <Card className="gap-5 p-5">
        <div className="flex items-center gap-2">
          <Award className="size-5 text-amber-500" />
          <span className="text-base font-semibold">Tier Progress</span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Current Tier</div>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="text-xl font-bold"
                    style={{ color: currentTier?.color || undefined }}
                  >
                    {currentTier?.name ?? 'Standard'}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {formatRate(currentTier?.commissionRate ?? 0)} commission
                  </Badge>
                </div>
              </div>
              {nextTier && (
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Next Tier</div>
                  <div className="mt-1 flex items-center justify-end gap-2">
                    <span
                      className="text-xl font-bold"
                      style={{ color: nextTier.color || undefined }}
                    >
                      {nextTier.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {formatRate(nextTier.commissionRate)}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {nextTier && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <ProgressRow
                  icon={<UserCheck className="size-4 text-primary" />}
                  label="Active Clients"
                  current={activeClients}
                  target={nextTier.minActiveClients}
                  pct={clientsPct}
                />
                <ProgressRow
                  icon={<BarChart3 className="size-4 text-primary" />}
                  label="Trading Volume"
                  current={formatVolume(totalVolume)}
                  target={formatVolume(nextTier.minVolume)}
                  pct={volPct}
                />
              </div>
            )}
          </>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Tier</th>
                  <th className="pb-3 font-medium">Commission</th>
                  <th className="pb-3 font-medium">Active Clients</th>
                  <th className="pb-3 font-medium">Trading Volume</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3">
                          <Skeleton className="h-5 w-20" />
                        </td>
                        <td className="py-3">
                          <Skeleton className="h-5 w-12" />
                        </td>
                        <td className="py-3">
                          <Skeleton className="h-5 w-14" />
                        </td>
                        <td className="py-3">
                          <Skeleton className="h-5 w-28" />
                        </td>
                      </tr>
                    ))
                  : allTiers.map((t) => (
                      <tr
                        key={t.id}
                        className={`border-b last:border-0 ${
                          t.name === currentTier?.name ? 'bg-primary/5' : ''
                        }`}
                      >
                        <td className="py-3">
                          <span
                            className="font-semibold"
                            style={{ color: t.color || undefined }}
                          >
                            {t.name}
                          </span>
                          {t.name === currentTier?.name && (
                            <Badge
                              variant="secondary"
                              className="ml-2 text-[10px]"
                            >
                              Current
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 font-medium tabular-nums">
                          {formatRate(t.commissionRate)}
                        </td>
                        <td className="py-3 tabular-nums">
                          {'>='} {t.minActiveClients}
                        </td>
                        <td className="py-3 tabular-nums">
                          {formatVolumeRange(t.minVolume, t.maxVolume)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProgressRow({
  icon,
  label,
  current,
  target,
  pct,
}: {
  icon: React.ReactNode;
  label: string;
  current: string | number;
  target: string | number;
  pct: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5">
          {icon}
          {label}
        </span>
        <span className="font-medium tabular-nums">
          {current} / {target}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover transition-all"
          style={{ width: `${Math.max(pct, pct > 0 ? 1 : 0)}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {pct >= 100
          ? 'Requirement met'
          : pct < 1 && pct > 0
            ? '< 1% complete'
            : `${Math.floor(pct)}% complete`}
      </p>
    </div>
  );
}
