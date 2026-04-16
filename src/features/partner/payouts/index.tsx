import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock, DollarSign, Wallet } from 'lucide-react';
import { toast } from 'sonner';

import { BaseTable, DataTableHeader } from '#/components/data-table';
import { Card } from '#/components/ui/card';
import { Button } from '#/components/ui/button';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import { PageHeader } from '#/components/common/page-header';
import { mockPayoutSummary, mockPayouts } from '#/features/partner/mock';
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
  const { data: summary = mockPayoutSummary } = useQuery({
    queryKey: ['partner', 'payouts', 'summary'],
    queryFn: () => Promise.resolve(mockPayoutSummary),
  });
  const { data: payouts = mockPayouts } = useQuery({
    queryKey: ['partner', 'payouts', 'list'],
    queryFn: () => Promise.resolve(mockPayouts),
  });

  const disabled = summary.pendingBalance < summary.minPayoutAmount;

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
                {money(summary.pendingBalance)}
              </div>
              <div className="text-xs text-muted-foreground">
                Minimum payout: {money(summary.minPayoutAmount)}
              </div>
            </div>
          </div>
          <Button
            disabled={disabled}
            onClick={() => toast.info('Payout request (Phase 3.5)')}
          >
            <DollarSign className="size-4" />
            Request Payout
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Paid"
          value={money(summary.totalPaid)}
          icon={CheckCircle}
        />
        <StatCard
          label="Pending Balance"
          value={money(summary.pendingBalance)}
          icon={Clock}
        />
        <StatCard
          label="Last Payout"
          value={summary.lastPayoutDate ?? '—'}
          icon={Clock}
        />
      </div>

      <BaseTable
        data={payouts}
        columns={payoutsColumns}
        rowKey="id"
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
