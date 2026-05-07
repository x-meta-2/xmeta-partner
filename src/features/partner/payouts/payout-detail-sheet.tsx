import { useQuery } from '@tanstack/react-query';

import { MarketCell } from '#/components/common/market-cell';
import { StatusTag } from '#/components/common/status-tag';
import { Skeleton } from '#/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import { getPayout, type Payout } from '#/services/apis/partner/payouts';
import { formatUSD } from '#/utils';
import { formatDate } from '#/utils/date';

interface PayoutDetailSheetProps {
  payout: Payout | null;
  onOpenChange: (open: boolean) => void;
}

export function PayoutDetailSheet({
  payout,
  onOpenChange,
}: PayoutDetailSheetProps) {
  const detailQuery = useQuery({
    queryKey: ['partner', 'payouts', 'detail', payout?.id],
    queryFn: () => getPayout(payout!.id),
    enabled: !!payout,
  });

  const items = detailQuery.data?.items ?? [];

  return (
    <Sheet open={!!payout} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Payout Detail</SheetTitle>
          <SheetDescription>
            {payout && (
              <span className="flex items-center gap-2">
                {formatUSD(payout.amount)} {payout.currency}
                <StatusTag status={payout.status} />
              </span>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 px-6 py-4">
          {payout && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-muted-foreground">Requested</div>
              <div>{formatDate(payout.createdAt)}</div>
              <div className="text-muted-foreground">Trades</div>
              <div>{payout.commissionCount}</div>
              <div className="text-muted-foreground">Transaction ID</div>
              <div className="font-mono text-xs">
                {payout.transactionId || '—'}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Commissions ({items.length})
            </h4>

            {detailQuery.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No commission items
              </p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-9 px-3 text-xs">Date</TableHead>
                      <TableHead className="h-9 px-3 text-xs">
                        Market
                      </TableHead>
                      <TableHead className="h-9 px-3 text-right text-xs">
                        Fee
                      </TableHead>
                      <TableHead className="h-9 px-3 text-right text-xs">
                        Rebate
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="px-3 py-2 text-xs">
                          {item.commission
                            ? formatDate(item.commission.tradeDate)
                            : '—'}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-xs">
                          {item.commission?.marketId ? (
                            <MarketCell marketId={item.commission.marketId} size="sm" />
                          ) : '—'}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-right tabular-nums text-xs">
                          {item.commission
                            ? formatUSD(item.commission.commissionAmount)
                            : '—'}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-right tabular-nums text-xs font-medium text-amber-500">
                          {formatUSD(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
