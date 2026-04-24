import type { PartnerTier } from '../types';

export interface DashboardSummary {
  totalCommission: number;
  thisMonthCommission: number;
  activeReferrals: number;
  referredVolume: number;
  commissionTrend: number;
  referralsTrend: number;
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
  amount: number;
}

export interface ReferralChartPoint {
  date: string;
  count: number;
}

export type ChartPeriod = '7d' | '30d' | '90d' | '1y';
