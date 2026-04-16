/**
 * Partner domain types — mirrors xmeta-partner-api data contracts.
 */

// ---------- Common response envelope ----------
export interface PartnerResponse<T> {
  message: string;
  body: T | null;
}

export interface PartnerPaginated<T> {
  total: number;
  items: T[];
}

export interface PartnerPaginationInput {
  pageSize?: number;
  current?: number;
  query?: string;
  sortDate?: {
    start_day?: string;
    end_day?: string;
  };
}

// ---------- Partner / Tier ----------
export interface PartnerTier {
  id: string;
  name: string;
  level: number;
  commissionRate: number;
  minReferrals: number;
  minVolume: number;
  benefits: string[];
}

export interface Partner {
  id: string;
  email: string;
  name: string;
  phone?: string;
  tier: PartnerTier;
  tierLevel: number;
  referralCode: string;
  walletAddress?: string;
  createdAt: string;
}

// ---------- Dashboard ----------
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
  referralProgress: number;
  volumeProgress: number;
  referralCount: number;
  totalVolume: number;
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

// ---------- Referrals ----------
export type KycStatus = 'verified' | 'pending' | 'rejected';
export type ReferralStatus = 'active' | 'inactive' | 'suspended';

export interface Referral {
  id: string;
  userId: string;
  email: string;
  registrationDate: string;
  kycStatus: KycStatus;
  tradingVolume: number;
  commission: number;
  status: ReferralStatus;
  lastActive: string;
}

export interface ReferralStats {
  total: number;
  verified: number;
  active: number;
  conversionRate: number;
}

// ---------- Links ----------
export type LinkStatus = 'active' | 'inactive';

export interface ReferralLink {
  id: string;
  code: string;
  url: string;
  clicks: number;
  registrations: number;
  conversions: number;
  status: LinkStatus;
  createdAt: string;
}

// ---------- Campaigns ----------
export type CampaignStatus = 'active' | 'paused' | 'ended';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  link: string;
  code: string;
  clicks: number;
  signups: number;
  conversions: number;
  commission: number;
  status: CampaignStatus;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

// ---------- Commissions / Earnings ----------
export type CommissionType = 'spot' | 'futures' | 'earn' | 'override';
export type CommissionStatus = 'pending' | 'confirmed' | 'paid';

export interface Commission {
  id: string;
  referralId: string;
  referralEmail: string;
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

// ---------- Payouts ----------
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

// ---------- Sub-affiliates ----------
export type SubAffiliateStatus = 'active' | 'inactive' | 'pending';

export interface SubAffiliate {
  id: string;
  name: string;
  email: string;
  referralCount: number;
  totalVolume: number;
  overrideCommission: number;
  status: SubAffiliateStatus;
  joinedAt: string;
}

export interface SubAffiliateStats {
  total: number;
  active: number;
  overrideEarned: number;
}
