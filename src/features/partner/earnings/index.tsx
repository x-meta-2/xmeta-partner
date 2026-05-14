import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';

import { PageHeader } from '#/components/common/page-header';
import { BaseTable, DataTableHeader } from '#/components/data-table';
import { useI18n } from '#/i18n/context';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import { listCommissions } from '#/services/apis/partner/commissions';
import { getDashboardSummary } from '#/services/apis/partner/dashboard';
import { getPendingPayouts } from '#/services/apis/partner/payouts';

import { formatUSD } from '#/utils';
import { getEarningsColumns } from './columns';

export function PartnerEarningsPage() {
  const { t } = useI18n();
  const summaryQuery = useQuery({
    queryKey: ['partner', 'dashboard', 'summary'],
    queryFn: getDashboardSummary,
  });
  const pendingQuery = useQuery({
    queryKey: ['partner', 'payouts', 'pending'],
    queryFn: getPendingPayouts,
  });
  const listQuery = useQuery({
    queryKey: ['partner', 'commissions', 'list'],
    queryFn: () => listCommissions({ current: 1, pageSize: 50 }),
  });

  const summary = summaryQuery.data;
  const pending = pendingQuery.data;
  const rows = listQuery.data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('partner:earnings.title')}
        description={t('partner:earnings.description')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t('partner:earnings.totalEarned')}
          value={formatUSD(summary?.totalEarnings ?? 0)}
          icon={DollarSign}
          isLoading={summaryQuery.isLoading}
        />
        <StatCard
          label={t('partner:earnings.pending')}
          value={formatUSD(pending?.pendingBalance ?? 0)}
          icon={Clock}
          hint={t('partner:earnings.awaiting')}
          isLoading={pendingQuery.isLoading}
        />
        <StatCard
          label={t('partner:earnings.paidOut')}
          value={formatUSD(pending?.totalPaid ?? 0)}
          icon={CheckCircle}
          hint={t('partner:earnings.lifetime')}
          isLoading={pendingQuery.isLoading}
        />
        <StatCard
          label={t('partner:earnings.thisMonth')}
          value={formatUSD(summary?.monthEarnings ?? 0)}
          icon={TrendingUp}
          isLoading={summaryQuery.isLoading}
        />
      </div>

      <BaseTable
        data={rows}
        columns={getEarningsColumns(t)}
        rowKey="id"
        isLoading={listQuery.isLoading}
        header={
          <DataTableHeader
            title={t('partner:earnings.history.title')}
            description={t('partner:earnings.history.description')}
          />
        }
        toolbar={{
          searchKey: 'marketId',
          searchPlaceholder: t('partner:earnings.search'),
          filters: [
            { columnId: 'status', title: t('partner:earnings.col.status'), options: [
              { label: t('partner:earnings.status.pending'), value: 'pending' },
              { label: t('partner:earnings.status.approved'), value: 'approved' },
              { label: t('partner:earnings.status.paid'), value: 'paid' },
              { label: t('partner:earnings.status.cancelled'), value: 'cancelled' },
            ] },
          ],
        }}
      />
    </div>
  );
}
