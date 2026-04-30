import { useQuery } from '@tanstack/react-query';
import { Activity, Calendar, Mail, Shield, Wallet } from 'lucide-react';

import { StatusTag } from '#/components/common/status-tag';
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
              <SheetTitle>Referral details</SheetTitle>
              <SheetDescription>
                Activity history for the referred user
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-5 px-6 py-6">
              <UserCard referral={referral} />
              <LifecycleCard referral={referral} />
              <TradeHistorySection
                trades={trades}
                isLoading={tradesQuery.isLoading}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function UserCard({ referral }: { referral: Referral }) {
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
        <Row icon={<Mail className="size-4" />} label="Email">
          <span className="font-mono text-xs">{u?.maskedEmail ?? '-'}</span>
        </Row>
        <Row icon={<Shield className="size-4" />} label="KYC level">
          {u?.kycLevel ?? 0}
        </Row>
      </div>
    </div>
  );
}

function LifecycleCard({ referral }: { referral: Referral }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-4 text-sm font-semibold">Lifecycle</div>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        <Row icon={<Calendar className="size-4" />} label="Registered">
          {formatDate(referral.registeredAt)}
        </Row>
        <Row icon={<Wallet className="size-4" />} label="First deposit">
          {formatDate(referral.firstDepositAt)}
        </Row>
        <Row icon={<Activity className="size-4" />} label="First trade">
          {formatDate(referral.firstTradeAt)}
        </Row>
        <Row icon={<Calendar className="size-4" />} label="Linked at">
          {formatDate(referral.startedAt)}
        </Row>
        {referral.endedAt && (
          <Row icon={<Calendar className="size-4" />} label="Unlinked at">
            {formatDate(referral.endedAt)}
          </Row>
        )}
      </div>
    </div>
  );
}

function TradeHistorySection({
  trades,
  isLoading,
}: {
  trades: Array<{
    id: string;
    tradeId: string;
    tradeAmount: number;
    commissionAmount: number;
    status: string;
    tradeDate: string;
  }>;
  isLoading: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="border-b bg-muted/40 px-5 py-3">
        <div className="text-sm font-semibold">Trade history</div>
        <div className="text-xs text-muted-foreground">
          One row = one trade. Commission is what you earned.
        </div>
      </div>

      {isLoading ? (
        <div className="px-5 py-6 text-sm text-muted-foreground">Loading…</div>
      ) : trades.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-muted-foreground">
          No trades yet.
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b bg-muted/20 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Date</span>
            <span className="text-right">Trade amount</span>
            <span className="text-right">Commission</span>
            <span>Status</span>
          </div>
          <div className="divide-y">
            {trades.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-3 text-sm transition-colors hover:bg-muted/30"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDateTime(t.tradeDate)}
                </span>
                <span className="text-right tabular-nums">
                  $
                  {t.tradeAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-right font-medium tabular-nums text-success">
                  +$
                  {t.commissionAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })}
                </span>
                <StatusTag status={t.status} size="sm" />
              </div>
            ))}
          </div>
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
