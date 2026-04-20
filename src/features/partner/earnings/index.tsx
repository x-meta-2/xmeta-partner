import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';

import { BaseTable, DataTableHeader } from '#/components/data-table';
import { Card } from '#/components/ui/card';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import { PageHeader } from '#/components/common/page-header';
import {
  mockCommissionBreakdown,
  mockCommissions,
  mockDashboardSummary,
  mockPayoutSummary,
} from '#/features/partner/mock';
import type { CommissionBreakdown } from '#/services/types/partner.types';
import { earningsColumns } from './columns';

const money = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const TYPE_OPTIONS = [
  { label: 'Spot', value: 'spot' },
  { label: 'Futures', value: 'futures' },
  { label: 'Earn', value: 'earn' },
  { label: 'Override', value: 'override' },
];

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Paid', value: 'paid' },
];

export function PartnerEarningsPage() {
  const { data: summary = mockDashboardSummary } = useQuery({
    queryKey: ['partner', 'earnings', 'summary'],
    queryFn: () => Promise.resolve(mockDashboardSummary),
  });
  const { data: pending = mockPayoutSummary } = useQuery({
    queryKey: ['partner', 'earnings', 'pending'],
    queryFn: () => Promise.resolve(mockPayoutSummary),
  });
  const { data: breakdown = mockCommissionBreakdown } = useQuery({
    queryKey: ['partner', 'earnings', 'breakdown'],
    queryFn: () => Promise.resolve(mockCommissionBreakdown),
  });
  const { data: rows = mockCommissions } = useQuery({
    queryKey: ['partner', 'earnings', 'list'],
    queryFn: () => Promise.resolve(mockCommissions),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Earnings"
        description="Commission breakdown across all product types"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Earned"
          value={money(summary.totalCommission)}
          trend={summary.commissionTrend}
          icon={DollarSign}
        />
        <StatCard
          label="Pending"
          value={money(pending.pendingBalance)}
          icon={Clock}
          hint="awaiting payout"
        />
        <StatCard
          label="Paid Out"
          value={money(pending.totalPaid)}
          icon={CheckCircle}
          hint="lifetime"
        />
        <StatCard
          label="This Month"
          value={money(summary.thisMonthCommission)}
          icon={TrendingUp}
        />
      </div>

      <BreakdownCard breakdown={breakdown} />

      <BaseTable
        data={rows}
        columns={earningsColumns}
        rowKey="id"
        header={
          <DataTableHeader
            title="Commission History"
            description="Every commission earned, broken down per trade"
          />
        }
        toolbar={{
          searchKey: 'referralId',
          searchPlaceholder: 'Search by referral email…',
          filters: [
            { columnId: 'type', title: 'Type', options: TYPE_OPTIONS },
            { columnId: 'status', title: 'Status', options: STATUS_OPTIONS },
          ],
        }}
      />
    </div>
  );
}

function BreakdownCard({ breakdown }: { breakdown: CommissionBreakdown }) {
  const rows: Array<{
    label: string;
    key: keyof CommissionBreakdown;
    color: string;
  }> = [
    { label: 'Spot', key: 'spot', color: 'bg-primary' },
    { label: 'Futures', key: 'futures', color: 'bg-chart-2' },
    { label: 'Earn', key: 'earn', color: 'bg-info' },
    { label: 'Override', key: 'override', color: 'bg-success' },
  ];

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-center justify-between">
        <div className="text-base font-medium">Breakdown by Product</div>
        <div className="text-sm text-muted-foreground">
          Total{' '}
          {breakdown.total.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
        </div>
      </div>
      <div className="space-y-3">
        {rows.map((r) => {
          const value = breakdown[r.key];
          const pct = breakdown.total
            ? Math.round((value / breakdown.total) * 100)
            : 0;
          return (
            <div key={r.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span>{r.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {money(value)} · {pct}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${r.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
