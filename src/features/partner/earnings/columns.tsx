import type { ColumnDef } from '@tanstack/react-table';

import { StatusTag } from '#/components/common/status-tag';
import type { Commission } from '#/services/types/partner.types';

const money = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const earningsColumns: ColumnDef<Commission>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => row.original.date.slice(0, 10),
  },
  {
    accessorKey: 'referralId',
    header: 'Referral',
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.referralId}</span>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <span className="capitalize">{row.original.type}</span>,
    filterFn: (row, _id, value: string[]) =>
      value.length === 0 || value.includes(row.original.type),
  },
  {
    accessorKey: 'tradingVolume',
    header: () => <div className="text-right">Volume</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {money(row.original.tradingVolume)}
      </div>
    ),
  },
  {
    accessorKey: 'rate',
    header: () => <div className="text-right">Rate</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">{row.original.rate}%</div>
    ),
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold tabular-nums text-primary">
        {money(row.original.amount)}
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
