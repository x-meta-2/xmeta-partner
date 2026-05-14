import { useQuery } from '@tanstack/react-query';
import { BarChart3, DollarSign, TrendingUp, Users } from 'lucide-react';

import { PageHeader } from '#/components/common/page-header';
import { useI18n } from '#/i18n/context';
import { listCommissions } from '#/services/apis/partner/commissions';
import {
  getDashboardSummary,
  getEarningsChart,
  getTierProgress,
} from '#/services/apis/partner/dashboard';
import { getProfile, PartnerStatus } from '#/services/apis/partner/profile';
import { useAuthStore } from '#/stores/auth-store';
import { formatUSD } from '#/utils';
import { EarningsChart } from './earnings-chart';
import { RecentActivity } from './recent-activity';
import { ReferralLinkCard } from './referral-link-card';
import { StatCard } from './stat-card';
import { TierProgressCard } from './tier-progress-card';

export function PartnerDashboardPage() {
  const { t } = useI18n();
  // Defensive: dashboard queries hit partner-only endpoints. PartnerGate
  // should already prevent mounting this component for non-partners, but
  // `enabled` here guarantees no request escapes if the gate ever misfires.
  const isActivePartner = useAuthStore(
    (s) => s.auth.partner?.status === PartnerStatus.Active,
  );

  const summaryQuery = useQuery({
    queryKey: ['partner', 'dashboard', 'summary'],
    queryFn: getDashboardSummary,
    enabled: isActivePartner,
  });
  const tierQuery = useQuery({
    queryKey: ['partner', 'dashboard', 'tier'],
    queryFn: getTierProgress,
    enabled: isActivePartner,
  });
  const chartQuery = useQuery({
    queryKey: ['partner', 'dashboard', 'earnings-chart', '30d'],
    queryFn: () => getEarningsChart('30d'),
    enabled: isActivePartner,
  });
  const partnerQuery = useQuery({
    queryKey: ['partner', 'profile'],
    queryFn: getProfile,
    enabled: isActivePartner,
  });
  const activityQuery = useQuery({
    queryKey: ['partner', 'commissions', 'recent'],
    queryFn: () => listCommissions({ current: 1, pageSize: 5 }),
    enabled: isActivePartner,
  });

  const summary = summaryQuery.data;
  const tier = tierQuery.data;
  const chart = chartQuery.data ?? [];
  const partner = partnerQuery.data;
  const activity = activityQuery.data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('partner:dashboard.title')}
        description={t('partner:dashboard.description')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t('partner:dashboard.totalCommission')}
          value={formatUSD(summary?.totalEarnings ?? 0)}
          icon={DollarSign}
          isLoading={summaryQuery.isLoading}
        />
        <StatCard
          label={t('partner:dashboard.thisMonth')}
          value={formatUSD(summary?.monthEarnings ?? 0)}
          icon={TrendingUp}
          isLoading={summaryQuery.isLoading}
        />
        <StatCard
          label={t('partner:dashboard.activeReferrals')}
          value={`${summary?.activeReferrals ?? 0} / ${summary?.totalReferrals ?? 0}`}
          icon={Users}
          hint={t('partner:dashboard.conversion', undefined, { rate: String(Math.floor(summary?.conversionRate ?? 0)) })}
          isLoading={summaryQuery.isLoading}
        />
        <StatCard
          label={t('partner:dashboard.referredVolume')}
          value={formatUSD(summary?.totalVolume ?? 0)}
          icon={BarChart3}
          isLoading={summaryQuery.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReferralLinkCard
            code={partner?.referralCode ?? ''}
            referralCount={summary?.activeReferrals ?? 0}
          />
        </div>
        {tier ? <TierProgressCard progress={tier} /> : null}
      </div>

      <EarningsChart data={chart} />

      <RecentActivity items={activity} />
    </div>
  );
}
