export const CommissionStatus = {
  Pending: 'pending',
  Approved: 'approved',
  Paid: 'paid',
  Cancelled: 'cancelled',
} as const;
export type CommissionStatus =
  (typeof CommissionStatus)[keyof typeof CommissionStatus];

export interface Commission {
  id: string;
  partnerId: string;
  referredUserId: string;
  positionId: string;
  marketId: string;
  asset: string;
  commissionAmount: number;
  volumeUsd: number;
  commissionRate: number;
  rebateAmount: number;
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
  rebateAmount: number;
  tradeVolume: number;
  count: number;
}
