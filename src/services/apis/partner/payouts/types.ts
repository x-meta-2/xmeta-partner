export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Payout {
  id: string;
  partnerId: string;
  amount: number;
  currency: string;
  commissionCount: number;
  periodStart: string;
  periodEnd: string;
  status: PayoutStatus;
  processedAt?: string;
  transactionId: string;
  failureReason: string;
  createdAt: string;
}

export interface PayoutSummary {
  pendingBalance: number;
  pendingCount: number;
  totalPaid: number;
  lastPayoutDate?: string;
  minPayoutAmount: number;
}

export interface PayoutItemCommission {
  id: string;
  marketId: string;
  commissionAmount: number;
  rebateAmount: number;
  tradeDate: string;
  status: string;
}

export interface PayoutItem {
  id: string;
  payoutId: string;
  commissionId: string;
  commission?: PayoutItemCommission;
  amount: number;
}

export interface PayoutDetail {
  payout: Payout;
  items: PayoutItem[];
}
