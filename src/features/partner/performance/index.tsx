import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  UserCheck,
  UserX,
  Target,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Badge } from '#/components/ui/badge';
import { Progress } from '#/components/ui/progress';
import { PageHeader } from '#/components/common/page-header';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import { mockPerformanceStats } from '#/features/partner/mock';
import { TIER_REQUIREMENTS, type TierName } from '#/services';

const money = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
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
  const { data: stats = mockPerformanceStats } = useQuery({
    queryKey: ['partner', 'performance'],
    queryFn: () => Promise.resolve(mockPerformanceStats),
  });

  const currentReqs = TIER_REQUIREMENTS[stats.currentTier];
  const nextReqs = stats.nextTier ? TIER_REQUIREMENTS[stats.nextTier] : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Statistics"
        description="Track your referral performance and tier progress"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Referrals"
          value={num(stats.totalReferrals)}
          icon={Users}
        />
        <StatCard
          label="Active Clients"
          value={num(stats.activeClients)}
          icon={UserCheck}
          hint="Futures trade in last 120 days"
        />
        <StatCard
          label="Total Volume"
          value={vol(stats.totalVolume)}
          icon={BarChart3}
        />
        <StatCard
          label="Total Commission"
          value={money(stats.totalCommission)}
          icon={DollarSign}
        />
      </div>

      {/* Tier Progress */}
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
              <div className={`text-2xl font-bold ${TIER_COLORS[stats.currentTier]}`}>
                {stats.currentTier}
              </div>
              <Badge variant="outline" className="mt-1">
                {(currentReqs.commission * 100).toFixed(0)}% commission
              </Badge>
            </div>
            {stats.nextTier && (
              <>
                <TrendingUp className="size-5 text-muted-foreground" />
                <div>
                  <span className="text-sm text-muted-foreground">Next Tier</span>
                  <div className={`text-2xl font-bold ${TIER_COLORS[stats.nextTier]}`}>
                    {stats.nextTier}
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {nextReqs ? `${(nextReqs.commission * 100).toFixed(0)}% commission` : ''}
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
                    {stats.activeClients} / {nextReqs.minActiveClients}
                  </span>
                </div>
                <Progress
                  value={Math.min(
                    (stats.activeClients / nextReqs.minActiveClients) * 100,
                    100
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {stats.activeClientsToNextTier > 0
                    ? `${stats.activeClientsToNextTier} more active clients needed`
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
                    {vol(stats.totalVolume)} / {vol(nextReqs.minVolume)}
                  </span>
                </div>
                <Progress
                  value={Math.min(
                    (stats.totalVolume / nextReqs.minVolume) * 100,
                    100
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {stats.volumeToNextTier > 0
                    ? `${vol(stats.volumeToNextTier)} more volume needed`
                    : 'Requirement met'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Breakdown */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserCheck className="size-4 text-success" />
            Active Clients
          </div>
          <div className="mt-1 text-3xl font-bold text-success tabular-nums">
            {num(stats.activeClients)}
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
            {num(stats.inactiveClients)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            No futures trade in last 120 days
          </p>
        </Card>
      </div>

      {/* Monthly Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="size-5" />
            Monthly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stats.monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                }}
              />
              <Legend />
              <Bar
                dataKey="newReferrals"
                name="New Referrals"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="activeClients"
                name="Active Clients"
                fill="hsl(var(--success))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* All Tiers Reference */}
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
                {(Object.entries(TIER_REQUIREMENTS) as [TierName, typeof TIER_REQUIREMENTS[TierName]][]).map(
                  ([name, req]) => (
                    <tr
                      key={name}
                      className={`border-b last:border-0 ${
                        name === stats.currentTier ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="py-3">
                        <span className={`font-semibold ${TIER_COLORS[name]}`}>
                          {name}
                        </span>
                        {name === stats.currentTier && (
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
                  )
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
