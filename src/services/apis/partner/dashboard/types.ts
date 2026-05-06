import type { PartnerTier } from '../types';

export interface DashboardSummary {
  totalEarnings: number;
  monthEarnings: number;
  pendingCommission: number;
  totalReferrals: number;
  activeReferrals: number;
  totalVolume: number;
  conversionRate: number;
}

export interface TierProgress {
  currentTier: PartnerTier;
  nextTier: PartnerTier | null;
  activeClients: number;
  totalVolume: number;
  activeClientsProgress: number;
  volumeProgress: number;
}

export interface ChartPoint {
  date: string;
  commissions: number;
  tradeVolume: number;
}

export interface ReferralChartPoint {
  date: string;
  signups: number;
}

export type ChartPeriod = '7d' | '30d' | '90d' | '1y';
