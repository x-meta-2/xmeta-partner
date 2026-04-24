export type CommissionType = 'spot' | 'futures' | 'earn' | 'override';
export type CommissionStatus = 'pending' | 'confirmed' | 'paid';

export interface Commission {
  id: string;
  referralId: string;
  type: CommissionType;
  amount: number;
  currency: string;
  tradingVolume: number;
  rate: number;
  status: CommissionStatus;
  date: string;
  createdAt: string;
}

export interface CommissionBreakdown {
  spot: number;
  futures: number;
  earn: number;
  override: number;
  total: number;
}

export interface DailyCommission {
  date: string;
  amount: number;
  count: number;
}
