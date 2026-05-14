import type { ColumnDef } from '@tanstack/react-table';

import { MarketCell } from '#/components/common/market-cell';
import { StatusTag } from '#/components/common/status-tag';
import type { Commission } from '#/services/apis/partner/commissions';
import { formatUSD } from '#/utils';

type TranslateFn = (key: string, defaultValue?: string) => string;

export const getEarningsColumns = (t: TranslateFn): ColumnDef<Commission>[] => [
  {
    accessorKey: 'tradeDate',
    header: t('partner:earnings.col.date'),
    cell: ({ row }) => row.original.tradeDate?.slice(0, 10) ?? '-',
  },
  {
    accessorKey: 'marketId',
    header: t('partner:earnings.col.trade'),
    cell: ({ row }) => <MarketCell marketId={row.original.marketId} />,
  },
  {
    accessorKey: 'commissionAmount',
    header: () => <div className="text-right">{t('partner:earnings.col.commission')}</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {formatUSD(row.original.commissionAmount ?? 0)}
      </div>
    ),
  },
  {
    accessorKey: 'rebateAmount',
    header: () => <div className="text-right">{t('partner:earnings.col.rate')}</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold tabular-nums text-primary">
        {formatUSD(row.original.rebateAmount ?? 0)}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: t('partner:earnings.col.status'),
    cell: ({ row }) => <StatusTag status={row.original.status} />,
    filterFn: (row, _id, value: string[]) =>
      value.length === 0 || value.includes(row.original.status),
  },
];
