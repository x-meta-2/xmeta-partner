import type { ColumnDef } from '@tanstack/react-table';

import { StatusTag } from '#/components/common/status-tag';
import type { Payout } from '#/services/apis/partner/payouts';

const money = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const formatDate = (iso: string) => new Date(iso).toISOString().slice(0, 10);
const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return `${d.toISOString().slice(0, 10)} ${d.toISOString().slice(11, 16)}`;
};

export const payoutsColumns: ColumnDef<Payout>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.id}</span>
    ),
  },
  {
    accessorKey: 'requestedAt',
    header: 'Requested',
    cell: ({ row }) => formatDate(row.original.requestedAt),
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold tabular-nums">
        {money(row.original.amount)} {row.original.currency}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusTag status={row.original.status} />,
    filterFn: (row, _id, value: string[]) =>
      value.length === 0 || value.includes(row.original.status),
  },
  {
    accessorKey: 'transactionId',
    header: 'Transaction ID',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.transactionId ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'completedAt',
    header: 'Completed',
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.completedAt ? formatDateTime(row.original.completedAt) : '—'}
      </span>
    ),
  },
];
