import type { TierName } from '../types';

export interface PerformanceStats {
  totalReferrals: number;
  activeClients: number;
  inactiveClients: number;
  totalVolume: number;
  totalCommission: number;
  currentTier: TierName;
  nextTier: TierName | null;
  activeClientsToNextTier: number;
  volumeToNextTier: number;
  monthlyStats: MonthlyPerformance[];
}

export interface MonthlyPerformance {
  month: string;
  newReferrals: number;
  activeClients: number;
  volume: number;
  commission: number;
}
