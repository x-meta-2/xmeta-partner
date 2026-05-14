import type { ColumnDef } from '@tanstack/react-table';

import { StatusTag } from '#/components/common/status-tag';
import type { Payout } from '#/services/apis/partner/payouts';
import { formatUSD } from '#/utils';
import { formatDate, formatDateTime } from '#/utils/date';

type TranslateFn = (key: string, defaultValue?: string) => string;

export const getPayoutsColumns = (t: TranslateFn): ColumnDef<Payout>[] => [
  {
    accessorKey: 'id',
    header: t('partner:payouts.col.id'),
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.id.slice(0, 8)}…</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: t('partner:payouts.col.requested'),
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">{t('partner:payouts.col.amount')}</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold tabular-nums">
        {formatUSD(row.original.amount)} {row.original.currency}
      </div>
    ),
  },
  {
    accessorKey: 'commissionCount',
    header: 'Trades',
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.commissionCount}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: t('partner:payouts.col.status'),
    cell: ({ row }) => <StatusTag status={row.original.status} />,
    filterFn: (row, _id, value: string[]) =>
      value.length === 0 || value.includes(row.original.status),
  },
  {
    accessorKey: 'transactionId',
    header: t('partner:payouts.col.transactionId'),
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.transactionId || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'processedAt',
    header: t('partner:payouts.col.completed'),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.processedAt
          ? formatDateTime(row.original.processedAt)
          : '—'}
      </span>
    ),
  },
];
