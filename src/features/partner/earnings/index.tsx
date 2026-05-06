import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';

import { PageHeader } from '#/components/common/page-header';
import { BaseTable, DataTableHeader } from '#/components/data-table';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import { listCommissions } from '#/services/apis/partner/commissions';
import { getDashboardSummary } from '#/services/apis/partner/dashboard';
import { getPendingPayouts } from '#/services/apis/partner/payouts';

import { formatUSD } from '#/utils';
import { earningsColumns } from './columns';

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Paid', value: 'paid' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function PartnerEarningsPage() {
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
        title="Earnings"
        description="Futures-trade commissions earned from your referred users"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Earned"
          value={formatUSD(summary?.totalEarnings ?? 0)}
          icon={DollarSign}
          isLoading={summaryQuery.isLoading}
        />
        <StatCard
          label="Pending"
          value={formatUSD(pending?.pendingBalance ?? 0)}
          icon={Clock}
          hint="awaiting payout"
          isLoading={pendingQuery.isLoading}
        />
        <StatCard
          label="Paid Out"
          value={formatUSD(pending?.totalPaid ?? 0)}
          icon={CheckCircle}
          hint="lifetime"
          isLoading={pendingQuery.isLoading}
        />
        <StatCard
          label="This Month"
          value={formatUSD(summary?.monthEarnings ?? 0)}
          icon={TrendingUp}
          isLoading={summaryQuery.isLoading}
        />
      </div>

      <BaseTable
        data={rows}
        columns={earningsColumns}
        rowKey="id"
        isLoading={listQuery.isLoading}
        header={
          <DataTableHeader
            title="Commission History"
            description="Every commission earned, broken down per trade"
          />
        }
        toolbar={{
          searchKey: 'marketId',
          searchPlaceholder: 'Search by market…',
          filters: [
            { columnId: 'status', title: 'Status', options: STATUS_OPTIONS },
          ],
        }}
      />
    </div>
  );
}
