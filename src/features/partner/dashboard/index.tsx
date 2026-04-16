import { useQuery } from '@tanstack/react-query';
import { BarChart3, DollarSign, TrendingUp, Users } from 'lucide-react';

import { StatCard } from './stat-card';
import { TierProgressCard } from './tier-progress-card';
import { ReferralLinkCard } from './referral-link-card';
import { EarningsChart } from './earnings-chart';
import { RecentActivity } from './recent-activity';
import { PageHeader } from '#/components/common/page-header';
import {
  mockDashboardSummary,
  mockEarningsChart,
  mockPartner,
  mockRecentActivity,
  mockTierProgress,
} from '#/features/partner/mock';

const money = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export function PartnerDashboardPage() {
  // TODO Phase 2: replace with real dashboardService.* calls
  const { data: summary = mockDashboardSummary } = useQuery({
    queryKey: ['partner', 'dashboard', 'summary'],
    queryFn: () => Promise.resolve(mockDashboardSummary),
  });
  const { data: tier = mockTierProgress } = useQuery({
    queryKey: ['partner', 'dashboard', 'tier'],
    queryFn: () => Promise.resolve(mockTierProgress),
  });
  const { data: chart = mockEarningsChart } = useQuery({
    queryKey: ['partner', 'dashboard', 'chart'],
    queryFn: () => Promise.resolve(mockEarningsChart),
  });
  const { data: activity = mockRecentActivity } = useQuery({
    queryKey: ['partner', 'dashboard', 'activity'],
    queryFn: () => Promise.resolve(mockRecentActivity),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your partner performance"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Commission"
          value={money(summary.totalCommission)}
          trend={summary.commissionTrend}
          icon={DollarSign}
          hint="vs. last 30 days"
        />
        <StatCard
          label="This Month"
          value={money(summary.thisMonthCommission)}
          icon={TrendingUp}
        />
        <StatCard
          label="Active Referrals"
          value={summary.activeReferrals.toString()}
          trend={summary.referralsTrend}
          icon={Users}
        />
        <StatCard
          label="Referred Volume"
          value={money(summary.referredVolume)}
          icon={BarChart3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReferralLinkCard
            code={mockPartner.referralCode}
            referralCount={summary.activeReferrals}
          />
        </div>
        <TierProgressCard progress={tier} />
      </div>

      <EarningsChart data={chart} />

      <RecentActivity items={activity} />
    </div>
  );
}
