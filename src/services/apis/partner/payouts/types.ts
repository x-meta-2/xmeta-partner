export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  transactionId?: string;
  walletAddress?: string;
  requestedAt: string;
  completedAt?: string;
}

export interface PayoutSummary {
  pendingBalance: number;
  totalPaid: number;
  lastPayoutDate?: string;
  minPayoutAmount: number;
}
