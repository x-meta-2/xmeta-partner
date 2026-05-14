import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Calendar, ChevronLeft, ChevronRight, Mail, Shield } from 'lucide-react';

import { StatusTag } from '#/components/common/status-tag';
import { useI18n } from '#/i18n/context';
import { truncateFloor } from '#/utils';
import { Button } from '#/components/ui/button';
import { Separator } from '#/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet';
import { listCommissions } from '#/services/apis/partner/commissions';
import type { Referral } from '#/services/apis/partner/referrals';
import { formatDate, formatDateTime } from '#/utils/date';

interface ReferralDetailDrawerProps {
  referral: Referral | null;
  onClose: () => void;
}

export function ReferralDetailDrawer({
  referral,
  onClose,
}: ReferralDetailDrawerProps) {
  const { t } = useI18n();
  const open = referral !== null;

  // Trade history = commissions earned from this referred user. Each
  // commission row is one trade (commission_engine inserts 1:1 per trade
  // event), so this doubles as the trade ledger.
  const tradesQuery = useQuery({
    queryKey: ['partner', 'commissions', 'by-user', referral?.referredUserId],
    queryFn: () =>
      listCommissions({
        referredUserId: referral?.referredUserId,
        pageSize: 100,
        current: 1,
      }),
    enabled: open,
  });

  const trades = tradesQuery.data?.items ?? [];

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-3xl">
        {referral && (
          <>
            <SheetHeader>
              <SheetTitle>{t('partner:referrals.detail.title')}</SheetTitle>
              <SheetDescription>
                {t('partner:referrals.detail.description')}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-5 px-6 py-6">
              <UserCard referral={referral} t={t} />
              <LifecycleCard referral={referral} t={t} />
              <TradeHistorySection
                trades={trades}
                isLoading={tradesQuery.isLoading}
                t={t}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function UserCard({ referral, t }: { referral: Referral; t: (key: string, defaultValue?: string, values?: Record<string, string | number>) => string }) {
  const u = referral.referredUser;
  const name = u ? `${u.firstName} ${u.lastInitial}`.trim() : '-';
  const initials =
    u?.firstName?.[0]?.toUpperCase() ??
    u?.maskedEmail?.[0]?.toUpperCase() ??
    '?';

  return (
    <div className="rounded-xl border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-base font-semibold text-primary">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold">{name}</div>
          <div className="truncate text-xs text-muted-foreground">
            {u?.maskedEmail ?? '-'}
          </div>
        </div>
        <StatusTag status={referral.status} />
      </div>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        <Row icon={<Mail className="size-4" />} label={t('partner:referrals.detail.email')}>
          <span className="font-mono text-xs">{u?.maskedEmail ?? '-'}</span>
        </Row>
        <Row icon={<Shield className="size-4" />} label={t('partner:referrals.detail.kycLevel')}>
          {u?.kycLevel ?? 0}
        </Row>
      </div>
    </div>
  );
}

function LifecycleCard({ referral, t }: { referral: Referral; t: (key: string, defaultValue?: string, values?: Record<string, string | number>) => string }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-4 text-sm font-semibold">{t('partner:referrals.detail.lifecycle')}</div>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        <Row icon={<Calendar className="size-4" />} label={t('partner:referrals.detail.registered')}>
          {formatDate(referral.registeredAt)}
        </Row>
        <Row icon={<Activity className="size-4" />} label={t('partner:referrals.detail.firstTrade')}>
          {formatDate(referral.firstTradeAt)}
        </Row>
        <Row icon={<Calendar className="size-4" />} label={t('partner:referrals.detail.linkedAt')}>
          {formatDate(referral.startedAt)}
        </Row>
        {referral.endedAt && (
          <Row icon={<Calendar className="size-4" />} label={t('partner:referrals.detail.unlinkedAt')}>
            {formatDate(referral.endedAt)}
          </Row>
        )}
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

function TradeHistorySection({
  trades,
  isLoading,
  t,
}: {
  trades: Array<{
    id: string;
    marketId: string;
    volumeUsd: number;
    rebateAmount: number;
    status: string;
    tradeDate: string;
  }>;
  isLoading: boolean;
  t: (key: string, defaultValue?: string, values?: Record<string, string | number>) => string;
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(trades.length / PAGE_SIZE);
  const paged = trades.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="border-b bg-muted/40 px-5 py-3">
        <div className="text-sm font-semibold">
          {t('partner:referrals.detail.tradeHistory')}{trades.length > 0 && ` (${trades.length})`}
        </div>
        <div className="text-xs text-muted-foreground">
          {t('partner:referrals.detail.tradeHistoryDescription')}
        </div>
      </div>

      {isLoading ? (
        <div className="px-5 py-6 text-sm text-muted-foreground">{t('partner:referrals.detail.loading')}</div>
      ) : trades.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-muted-foreground">
          {t('partner:referrals.detail.noTrades')}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b bg-muted/20 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>{t('partner:referrals.detail.col.date')}</span>
            <span className="text-right">{t('partner:referrals.detail.col.volume')}</span>
            <span className="text-right">{t('partner:referrals.detail.col.commission')}</span>
            <span>{t('partner:referrals.detail.col.status')}</span>
          </div>
          <div className="divide-y">
            {paged.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-3 text-sm transition-colors hover:bg-muted/30"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDateTime(row.tradeDate)}
                </span>
                <span className="text-right tabular-nums">
                  $
                  {truncateFloor(row.volumeUsd ?? 0, 2).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-right font-medium tabular-nums text-success">
                  +$
                  {truncateFloor(row.rebateAmount ?? 0, 4).toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })}
                </span>
                <StatusTag status={row.status} size="sm" />
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-5 py-2.5">
              <span className="text-xs text-muted-foreground">
                {t('partner:referrals.detail.page', undefined, { current: page + 1, total: totalPages })}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="truncate font-medium text-foreground">{children}</div>
    </div>
  );
}
