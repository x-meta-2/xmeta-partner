import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock, DollarSign, Eye, Wallet } from 'lucide-react';

import { PageHeader } from '#/components/common/page-header';
import { BaseTable, DataTableHeader } from '#/components/data-table';
import { Button } from '#/components/ui/button';
import { Card } from '#/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#/components/ui/tooltip';
import { StatCard } from '#/features/partner/dashboard/stat-card';
import {
  getPendingPayouts,
  listPayouts,
  type Payout,
} from '#/services/apis/partner/payouts';
import { formatUSD } from '#/utils';

import { payoutsColumns } from './columns';
import { PayoutDetailSheet } from './payout-detail-sheet';
import { RequestPayoutDialog } from './request-payout-dialog';

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
];

export function PartnerPayoutsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);

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
  const minAmount = summary?.minPayoutAmount ?? 10;
  const belowMin = pendingBalance < minAmount;

  const payoutButton = (
    <Button disabled={belowMin} onClick={() => setDialogOpen(true)}>
      <DollarSign className="size-4" />
      Request Payout
    </Button>
  );

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
                {formatUSD(pendingBalance)}
              </div>
              <div className="text-xs text-muted-foreground">
                Minimum payout: {formatUSD(minAmount)}
              </div>
            </div>
          </div>
          {belowMin ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0}>{payoutButton}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Minimum payout amount is {formatUSD(minAmount)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            payoutButton
          )}
        </div>
      </Card>

      <RequestPayoutDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        pendingBalance={pendingBalance}
        pendingCount={summary?.pendingCount ?? 0}
      />

      <PayoutDetailSheet
        payout={selectedPayout}
        onOpenChange={(open) => {
          if (!open) setSelectedPayout(null);
        }}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Paid"
          value={formatUSD(summary?.totalPaid ?? 0)}
          icon={CheckCircle}
          isLoading={summaryQuery.isLoading}
        />
        <StatCard
          label="Pending Balance"
          value={formatUSD(pendingBalance)}
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
        rowActions={(row) => (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSelectedPayout(row)}
          >
            <Eye className="size-4" />
          </Button>
        )}
      />
    </div>
  );
}
