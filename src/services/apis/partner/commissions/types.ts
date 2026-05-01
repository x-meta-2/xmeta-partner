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
  status: CommissionStatus;
  payoutId: string | null;
  tradeDate: string;
  createdAt: string;
}

/** Total commission earnings within an optional date window. Futures is the only trade type. */
export interface CommissionBreakdown {
  futures: number;
  total: number;
}

export interface DailyCommission {
  date: string;
  amount: number;
  count: number;
}
