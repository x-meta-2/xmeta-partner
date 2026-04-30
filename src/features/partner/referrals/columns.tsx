import type { ColumnDef } from '@tanstack/react-table';

import { StatusTag } from '#/components/common/status-tag';
import type { Referral } from '#/services/apis/partner/referrals';
import { formatDate } from '#/utils/date';

export const referralsColumns: ColumnDef<Referral>[] = [
  {
    id: 'email',
    accessorFn: (row) => row.referredUser?.maskedEmail ?? '',
    header: 'Email',
    cell: ({ row }) => (
      <span className="text-xs">
        {row.original.referredUser?.maskedEmail ?? '-'}
      </span>
    ),
    filterFn: (row, _id, value: string) => {
      const q = value.toLowerCase();
      return (row.original.referredUser?.maskedEmail ?? '')
        .toLowerCase()
        .includes(q);
    },
  },
  {
    id: 'name',
    accessorFn: (row) =>
      row.referredUser
        ? `${row.referredUser.firstName} ${row.referredUser.lastInitial}`.trim()
        : '',
    header: 'Name',
    cell: ({ row }) => {
      const u = row.original.referredUser;
      return <span>{u ? `${u.firstName} ${u.lastInitial}`.trim() : '-'}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusTag status={row.original.status} />,
    filterFn: (row, _id, value: string[]) =>
      value.length === 0 || value.includes(row.original.status),
  },
  {
    id: 'kycLevel',
    accessorFn: (row) => row.referredUser?.kycLevel ?? 0,
    header: () => <div className="text-right">KYC</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.original.referredUser?.kycLevel ?? 0}
      </div>
    ),
  },
  {
    accessorKey: 'startedAt',
    header: 'Linked',
    cell: ({ row }) => formatDate(row.original.startedAt),
  },
  {
    accessorKey: 'firstDepositAt',
    header: 'First deposit',
    cell: ({ row }) => formatDate(row.original.firstDepositAt),
  },
  {
    accessorKey: 'firstTradeAt',
    header: 'First trade',
    cell: ({ row }) => formatDate(row.original.firstTradeAt),
  },
];
