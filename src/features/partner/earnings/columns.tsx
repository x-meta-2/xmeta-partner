import type { ColumnDef } from '@tanstack/react-table';

import { StatusTag } from '#/components/common/status-tag';
import type { Commission } from '#/services/apis/partner/commissions';

const money = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const percent = (v: number) => `${(v * 100).toFixed(2)}%`;

export const earningsColumns: ColumnDef<Commission>[] = [
  {
    accessorKey: 'tradeDate',
    header: 'Date',
    cell: ({ row }) => row.original.tradeDate.slice(0, 10),
  },
  {
    accessorKey: 'tradeId',
    header: 'Trade',
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.tradeId}</span>
    ),
  },
  {
    accessorKey: 'isOverride',
    header: 'Source',
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.isOverride ? 'Override' : 'Futures'}
      </span>
    ),
  },
  {
    accessorKey: 'tradeAmount',
    header: () => <div className="text-right">Volume</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {money(row.original.tradeAmount)}
      </div>
    ),
  },
  {
    accessorKey: 'commissionRate',
    header: () => <div className="text-right">Rate</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {percent(row.original.commissionRate)}
      </div>
    ),
  },
  {
    accessorKey: 'commissionAmount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold tabular-nums text-primary">
        {money(row.original.commissionAmount)}
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
];
