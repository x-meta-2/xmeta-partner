import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock, DollarSign, Wallet } from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '#/components/common/page-header';
import { BaseTable, DataTableHeader } from '#/components/data-table';
import { Button } from '#/components/ui/button';
import { Card } from '#/components/ui/card';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import {
  getPendingPayouts,
  listPayouts,
} from '#/services/apis/partner/payouts';

import { payoutsColumns } from './columns';

const money = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
];

export function PartnerPayoutsPage() {
  const summaryQuery = useQuery({
    queryKey: ['partner', 'payouts', 'pending'],
    queryFn: getPendingPayouts,
  });
  const listQuery = useQuery({
    queryKey: ['partner', 'payouts', 'list'],
    queryFn: () => listPayouts({ current: 1, pageSize: 50 }),
  });

  const summary = summaryQuery.data;
  const payouts = listQuery.data?.items ?? [];

  const pendingBalance = summary?.pendingBalance ?? 0;
  const minAmount = summary?.minPayoutAmount ?? 0;
  const disabled = pendingBalance < minAmount;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payouts"
        description="View your payout history and pending balance"
      />

      <Card className="gap-0 bg-gradient-to-br from-primary-soft to-transparent p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Wallet className="size-5" />
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                Available for Payout
              </div>
              <div className="text-3xl font-semibold tracking-tight text-primary">
                {money(pendingBalance)}
              </div>
              <div className="text-xs text-muted-foreground">
                Minimum payout: {money(minAmount)}
              </div>
            </div>
          </div>
          <Button
            disabled={disabled}
            onClick={() => toast.info('Payout request coming soon')}
          >
            <DollarSign className="size-4" />
            Request Payout
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Paid"
          value={money(summary?.totalPaid ?? 0)}
          icon={CheckCircle}
          isLoading={summaryQuery.isLoading}
        />
        <StatCard
          label="Pending Balance"
          value={money(pendingBalance)}
          icon={Clock}
          isLoading={summaryQuery.isLoading}
        />
        <StatCard
          label="Last Payout"
          value={summary?.lastPayoutDate ?? '—'}
          icon={Clock}
          isLoading={summaryQuery.isLoading}
        />
      </div>

      <BaseTable
        data={payouts}
        columns={payoutsColumns}
        rowKey="id"
        isLoading={listQuery.isLoading}
        header={
          <DataTableHeader
            title="Payout History"
            description="All your payout requests and their status"
          />
        }
        toolbar={{
          searchKey: 'id',
          searchPlaceholder: 'Search by payout ID…',
          filters: [
            { columnId: 'status', title: 'Status', options: STATUS_OPTIONS },
          ],
        }}
      />
    </div>
  );
}
