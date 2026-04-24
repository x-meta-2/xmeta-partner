import type { ColumnDef } from '@tanstack/react-table';

import { StatusTag } from '#/components/common/status-tag';
import type { SubAffiliate } from '#/services';

const money = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const subAffiliatesColumns: ColumnDef<SubAffiliate>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: 'referralCount',
    header: () => <div className="text-right">Referrals</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">{row.original.referralCount}</div>
    ),
  },
  {
    accessorKey: 'totalVolume',
    header: () => <div className="text-right">Volume</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {money(row.original.totalVolume)}
      </div>
    ),
  },
  {
    accessorKey: 'overrideCommission',
    header: () => <div className="text-right">Override</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold tabular-nums text-primary">
        {money(row.original.overrideCommission)}
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
    accessorKey: 'joinedAt',
    header: 'Joined',
    cell: ({ row }) => row.original.joinedAt.slice(0, 10),
  },
];
