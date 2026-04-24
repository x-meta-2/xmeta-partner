import type { ColumnDef } from '@tanstack/react-table';

import { StatusTag } from '#/components/common/status-tag';
import type { Referral } from '#/services/apis/partner/referrals';

const money = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const formatDate = (iso: string) => new Date(iso).toISOString().slice(0, 10);

export const referralsColumns: ColumnDef<Referral>[] = [
  {
    accessorKey: 'userId',
    header: 'User ID',
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.userId}</span>
    ),
    filterFn: (row, _id, value: string) => {
      const q = value.toLowerCase();
      return row.original.userId.toLowerCase().includes(q);
    },
  },
  {
    accessorKey: 'registrationDate',
    header: 'Registration',
    cell: ({ row }) => formatDate(row.original.registrationDate),
  },
  {
    accessorKey: 'kycStatus',
    header: 'KYC',
    cell: ({ row }) => <StatusTag status={row.original.kycStatus} />,
  },
  {
    accessorKey: 'tradingVolume',
    header: () => <div className="text-right">Trading Volume</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {money(row.original.tradingVolume)}
      </div>
    ),
  },
  {
    accessorKey: 'commission',
    header: () => <div className="text-right">Commission</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold tabular-nums text-primary">
        {money(row.original.commission)}
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
    accessorKey: 'lastActive',
    header: 'Last Active',
    cell: ({ row }) => formatDate(row.original.lastActive),
  },
  {
    accessorKey: 'note',
    header: 'Note',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.note || '-'}
      </span>
    ),
  },
];
