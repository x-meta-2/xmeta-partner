/**
 * Partner domain types — mirrors xmeta-partner-api data contracts.
 *
 * Key business rules:
 * - Status: "active" if futures trade within last 120 days, else "inactive"
 * - Referral codes: 5-7 uppercase chars, max 3 per partner, no edit/delete
 * - XMETA regex blocked in referral codes
 * - No email field exposed for referrals
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

// ---------- Tier ----------

export type TierName = 'Standard' | 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

export interface PartnerTier {
  id: string;
  name: TierName;
  level: number;
  commissionRate: number;
  minReferrals: number;
  minVolume: number;
  isDefault: boolean;
  color: string;
}

/** Tier requirements for display & auto-upgrade logic */
export const TIER_REQUIREMENTS: Record<
  TierName,
  { commission: number; minActiveClients: number; minVolume: number; maxVolume: number | null }
> = {
  Standard: { commission: 0.2, minActiveClients: 0, minVolume: 0, maxVolume: 15_000_000 },
  Bronze: { commission: 0.25, minActiveClients: 1, minVolume: 15_000_000, maxVolume: 30_000_000 },
  Silver: { commission: 0.3, minActiveClients: 3, minVolume: 30_000_000, maxVolume: 150_000_000 },
  Gold: { commission: 0.35, minActiveClients: 8, minVolume: 150_000_000, maxVolume: 450_000_000 },
  Diamond: { commission: 0.4, minActiveClients: 10, minVolume: 450_000_000, maxVolume: null },
};

// ---------- Partner ----------
export interface Partner {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  phone?: string;
  country?: string;
  website?: string;
  tier: PartnerTier;
  tierLevel: number;
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  status: PartnerStatus;
  walletAddress?: string;
  createdAt: string;
}

export type PartnerStatus = 'pending' | 'active' | 'suspended';

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

// ---------- Referrals ----------
/**
 * Status logic:
 * - active: user made at least 1 futures trade in last 120 days
 * - inactive: no futures trade in last 120 days
 *
 * Note: email is NOT exposed — privacy requirement
 */
export type ReferralStatus = 'active' | 'inactive';

export interface Referral {
  id: string;
  userId: string;
  registrationDate: string;
  kycStatus: KycStatus;
  tradingVolume: number;
  commission: number;
  status: ReferralStatus;
  lastActive: string;
  note?: string;
}

export type KycStatus = 'verified' | 'pending' | 'rejected';

export interface ReferralStats {
  total: number;
  verified: number;
  active: number;
  inactive: number;
  conversionRate: number;
}

// ---------- Referral Links ----------
/**
 * Link rules:
 * - Code: 5-7 uppercase alphanumeric characters
 * - Max 3 links per partner
 * - Default link (7 chars, uppercase) auto-created on first login
 * - Cannot edit or delete links
 * - Regex validation: must NOT contain "XMETA" (case-insensitive)
 */
export type LinkStatus = 'active';

export interface ReferralLink {
  id: string;
  code: string;
  url: string;
  clicks: number;
  registrations: number;
  conversions: number;
  status: LinkStatus;
  isDefault: boolean;
  createdAt: string;
}

export const REFERRAL_CODE_MIN_LENGTH = 5;
export const REFERRAL_CODE_MAX_LENGTH = 7;
export const REFERRAL_CODE_MAX_COUNT = 3;
export const REFERRAL_CODE_BLOCKED_REGEX = /XMETA/i;

export function validateReferralCode(code: string): string | null {
  if (code.length < REFERRAL_CODE_MIN_LENGTH) {
    return `Code must be at least ${REFERRAL_CODE_MIN_LENGTH} characters`;
  }
  if (code.length > REFERRAL_CODE_MAX_LENGTH) {
    return `Code must be at most ${REFERRAL_CODE_MAX_LENGTH} characters`;
  }
  if (!/^[A-Z0-9]+$/.test(code)) {
    return 'Code must contain only uppercase letters and numbers';
  }
  if (REFERRAL_CODE_BLOCKED_REGEX.test(code)) {
    return 'Code cannot contain "XMETA"';
  }
  return null;
}

// ---------- Campaigns (disabled / coming soon) ----------
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

// ---------- Performance Statistics ----------
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
