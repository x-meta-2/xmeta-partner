export const CommissionStatus = {
  Pending: 'pending',
  Approved: 'approved',
  Paid: 'paid',
  Cancelled: 'cancelled',
} as const;
export type CommissionStatus =
  (typeof CommissionStatus)[keyof typeof CommissionStatus];

/** Mirrors the Go `database.Commission` struct returned by the API. */
export interface Commission {
  id: string;
  partnerId: string;
  referredUserId: string;
  tradeId: string;
  tradeAmount: number;
  commissionRate: number;
  commissionAmount: number;
  tierId: string | null;
  isOverride: boolean;
  overridePartnerId: string | null;
  status: CommissionStatus;
  payoutId: string | null;
  tradeDate: string;
  createdAt: string;
}

/** Futures-only commission split between direct earnings and sub-affiliate overrides. */
export interface CommissionBreakdown {
  futures: number;
  override: number;
  total: number;
}

export interface DailyCommission {
  date: string;
  amount: number;
  count: number;
}
