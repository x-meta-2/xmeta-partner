import { useQuery } from '@tanstack/react-query';
import {
  Award,
  BarChart3,
  DollarSign,
  TrendingUp,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';

import { PageHeader } from '#/components/common/page-header';
import { Badge } from '#/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Progress } from '#/components/ui/progress';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import { getDashboardSummary, getTierProgress } from '#/services/apis/partner/dashboard';
import { getReferralStats } from '#/services/apis/partner/referrals';
import { TIER_REQUIREMENTS, type TierName } from '#/services/apis/partner/types';

const money = (v: number) =>
  v.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
const num = (v: number) => v.toLocaleString('en-US');
const vol = (v: number) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
};

const TIER_COLORS: Record<TierName, string> = {
  Standard: 'text-muted-foreground',
  Bronze: 'text-amber-700',
  Silver: 'text-slate-400',
  Gold: 'text-yellow-500',
  Diamond: 'text-cyan-400',
};

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

  const summary = summaryQuery.data;
  const tier = tierQuery.data;
  const refStats = refStatsQuery.data;

  const currentTierName = (tier?.currentTier.name ?? 'Standard') as TierName;
  const nextTierName = tier?.nextTier?.name as TierName | undefined;
  const currentReqs = TIER_REQUIREMENTS[currentTierName];
  const nextReqs = nextTierName ? TIER_REQUIREMENTS[nextTierName] : null;

  const activeClients = tier?.activeClients ?? 0;
  const totalVolume = tier?.totalVolume ?? 0;
  const activeClientsToNext = nextReqs
    ? Math.max(0, nextReqs.minActiveClients - activeClients)
    : 0;
  const volumeToNext = nextReqs
    ? Math.max(0, nextReqs.minVolume - totalVolume)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Statistics"
        description="Track your referral performance and tier progress"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Referrals"
          value={num(refStats?.total ?? 0)}
          icon={Users}
        />
        <StatCard
          label="Active Clients"
          value={num(activeClients)}
          icon={UserCheck}
          hint="Futures trade in last 120 days"
        />
        <StatCard
          label="Total Volume"
          value={vol(totalVolume)}
          icon={BarChart3}
        />
        <StatCard
          label="Total Commission"
          value={money(summary?.totalCommission ?? 0)}
          icon={DollarSign}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="size-5" />
            Tier Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Current Tier</span>
              <div className={`text-2xl font-bold ${TIER_COLORS[currentTierName]}`}>
                {currentTierName}
              </div>
              <Badge variant="outline" className="mt-1">
                {(currentReqs.commission * 100).toFixed(0)}% commission
              </Badge>
            </div>
            {nextTierName && nextReqs && (
              <>
                <TrendingUp className="size-5 text-muted-foreground" />
                <div>
                  <span className="text-sm text-muted-foreground">Next Tier</span>
                  <div className={`text-2xl font-bold ${TIER_COLORS[nextTierName]}`}>
                    {nextTierName}
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {(nextReqs.commission * 100).toFixed(0)}% commission
                  </Badge>
                </div>
              </>
            )}
          </div>

          {nextReqs && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="size-4 text-primary" />
                    Active Clients
                  </span>
                  <span className="font-medium tabular-nums">
                    {activeClients} / {nextReqs.minActiveClients}
                  </span>
                </div>
                <Progress
                  value={Math.min(
                    (activeClients / nextReqs.minActiveClients) * 100,
                    100,
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {activeClientsToNext > 0
                    ? `${activeClientsToNext} more active clients needed`
                    : 'Requirement met'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="size-4 text-primary" />
                    Trading Volume
                  </span>
                  <span className="font-medium tabular-nums">
                    {vol(totalVolume)} / {vol(nextReqs.minVolume)}
                  </span>
                </div>
                <Progress
                  value={Math.min((totalVolume / nextReqs.minVolume) * 100, 100)}
                />
                <p className="text-xs text-muted-foreground">
                  {volumeToNext > 0
                    ? `${vol(volumeToNext)} more volume needed`
                    : 'Requirement met'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserCheck className="size-4 text-success" />
            Active Clients
          </div>
          <div className="mt-1 text-3xl font-bold text-success tabular-nums">
            {num(activeClients)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Futures trade within last 120 days
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserX className="size-4 text-destructive" />
            Inactive Clients
          </div>
          <div className="mt-1 text-3xl font-bold text-destructive tabular-nums">
            {num(refStats?.inactive ?? 0)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            No futures trade in last 120 days
          </p>
        </Card>
      </div>

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
                {(
                  Object.entries(TIER_REQUIREMENTS) as [
                    TierName,
                    (typeof TIER_REQUIREMENTS)[TierName],
                  ][]
                ).map(([name, req]) => (
                  <tr
                    key={name}
                    className={`border-b last:border-0 ${
                      name === currentTierName ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="py-3">
                      <span className={`font-semibold ${TIER_COLORS[name]}`}>
                        {name}
                      </span>
                      {name === currentTierName && (
                        <Badge variant="secondary" className="ml-2 text-[10px]">
                          Current
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 font-medium tabular-nums">
                      {(req.commission * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 tabular-nums">
                      {'>='} {req.minActiveClients}
                    </td>
                    <td className="py-3 tabular-nums">
                      {vol(req.minVolume)}
                      {req.maxVolume ? ` – ${vol(req.maxVolume)}` : '+'}
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
