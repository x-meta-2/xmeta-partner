/**
 * Temporary mock data for partner features.
 *
 * IMPORTANT — SSR safety:
 *   - All timestamps derive from `MOCK_NOW` (fixed), never `Date.now()` /
 *     `new Date()`. The mock module is evaluated on both server and client
 *     during SSR; non-deterministic values trigger hydration mismatches.
 *   - All randomised numbers go through `seededRand(i)` (deterministic),
 *     not `Math.random()`.
 *
 * Remove once xmeta-partner-api is wired up.
 */
import type {
  Campaign,
  Commission,
  CommissionBreakdown,
  DailyCommission,
  DashboardSummary,
  Partner,
  Payout,
  PayoutSummary,
  Referral,
  ReferralLink,
  ReferralStats,
  SubAffiliate,
  SubAffiliateStats,
  TierProgress,
} from '#/services/types/partner.types';

const MOCK_NOW = new Date('2026-04-15T12:00:00Z').getTime();
const DAY = 86_400_000;

/** Deterministic pseudo-random in [0, 1) based on an integer seed. */
const seededRand = (seed: number) => {
  const x = Math.sin(seed * 9_301 + 49_297) * 233_280;
  return x - Math.floor(x);
};

export const mockPartner: Partner = {
  id: 'p_1001',
  email: 'partner@x-meta.com',
  name: 'Demo Partner',
  phone: '+976 9911 2233',
  tierLevel: 2,
  referralCode: 'DEMO2026',
  walletAddress: 'TXyZ1234abcdEFghIJklMnopQRstUV9999',
  createdAt: '2025-09-14T00:00:00Z',
  tier: {
    id: 't_silver',
    name: 'Silver',
    level: 2,
    commissionRate: 35,
    minReferrals: 10,
    minVolume: 100_000,
    benefits: ['35% commission', 'Priority support'],
  },
};

export const mockDashboardSummary: DashboardSummary = {
  totalCommission: 12_482.55,
  thisMonthCommission: 2_140.0,
  activeReferrals: 47,
  referredVolume: 385_600,
  commissionTrend: 12.4,
  referralsTrend: 6.1,
};

export const mockTierProgress: TierProgress = {
  currentTier: mockPartner.tier,
  nextTier: {
    id: 't_gold',
    name: 'Gold',
    level: 3,
    commissionRate: 40,
    minReferrals: 25,
    minVolume: 500_000,
    benefits: ['40% commission', 'Dedicated manager'],
  },
  referralProgress: 47 / 100,
  volumeProgress: 385_600 / 500_000,
  referralCount: 47,
  totalVolume: 385_600,
};

export const mockEarningsChart = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(MOCK_NOW - (29 - i) * DAY).toISOString().slice(0, 10),
  amount: Math.round(100 + seededRand(i + 1) * 300),
}));

export const mockReferrals: Referral[] = Array.from({ length: 8 }, (_, i) => ({
  id: `r_${1000 + i}`,
  userId: `u_${2000 + i}`,
  email: `user${i + 1}@example.com`,
  registrationDate: new Date(MOCK_NOW - i * DAY * 3).toISOString(),
  kycStatus: i % 3 === 0 ? 'pending' : 'verified',
  tradingVolume: Math.round(5_000 + seededRand(i + 10) * 40_000),
  commission: Math.round(50 + seededRand(i + 20) * 400),
  status: i % 4 === 0 ? 'inactive' : 'active',
  lastActive: new Date(MOCK_NOW - i * DAY).toISOString(),
}));

export const mockReferralStats: ReferralStats = {
  total: 92,
  verified: 68,
  active: 47,
  conversionRate: 51,
};

export const mockLinks: ReferralLink[] = [
  {
    id: 'l_1',
    code: 'DEMO2026',
    url: 'https://x-meta.com/ref/DEMO2026',
    clicks: 1_342,
    registrations: 220,
    conversions: 88,
    status: 'active',
    createdAt: '2025-11-01T00:00:00Z',
  },
  {
    id: 'l_2',
    code: 'YOUTUBE',
    url: 'https://x-meta.com/ref/YOUTUBE',
    clicks: 512,
    registrations: 64,
    conversions: 21,
    status: 'active',
    createdAt: '2026-02-02T00:00:00Z',
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: 'c_1',
    name: 'YouTube Spring',
    description: 'Video series promoting spot trading fees',
    link: 'https://x-meta.com/ref/YTSPRING',
    code: 'YTSPRING',
    clicks: 812,
    signups: 133,
    conversions: 48,
    commission: 1_240,
    status: 'active',
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    createdAt: '2026-02-24T00:00:00Z',
  },
  {
    id: 'c_2',
    name: 'Telegram Channel',
    description: 'Daily signal channel referrals',
    link: 'https://x-meta.com/ref/TGCHAN',
    code: 'TGCHAN',
    clicks: 2_104,
    signups: 402,
    conversions: 110,
    commission: 2_980,
    status: 'active',
    startDate: '2025-12-01',
    createdAt: '2025-11-28T00:00:00Z',
  },
];

export const mockCommissions: Commission[] = Array.from({ length: 12 }, (_, i) => ({
  id: `cm_${i}`,
  referralId: `r_${1000 + (i % 8)}`,
  referralEmail: `user${(i % 8) + 1}@example.com`,
  type: (['spot', 'futures', 'earn', 'override'] as const)[i % 4],
  amount: Math.round(20 + seededRand(i + 30) * 300),
  currency: 'USDT',
  tradingVolume: Math.round(1_000 + seededRand(i + 40) * 20_000),
  rate: 35,
  status: (['pending', 'confirmed', 'paid'] as const)[i % 3],
  date: new Date(MOCK_NOW - i * DAY).toISOString(),
  createdAt: new Date(MOCK_NOW - i * DAY).toISOString(),
}));

export const mockCommissionBreakdown: CommissionBreakdown = {
  spot: 4_820,
  futures: 5_100,
  earn: 1_360,
  override: 1_202,
  total: 12_482,
};

export const mockDailySummary: DailyCommission[] = mockEarningsChart.map(
  (p, i) => ({
    date: p.date,
    amount: p.amount,
    count: Math.round(1 + seededRand(i + 50) * 4),
  }),
);

export const mockPayoutSummary: PayoutSummary = {
  pendingBalance: 820.55,
  totalPaid: 9_240.0,
  lastPayoutDate: '2026-03-28',
  minPayoutAmount: 50,
};

export const mockPayouts: Payout[] = [
  {
    id: 'po_1',
    amount: 500,
    currency: 'USDT',
    status: 'completed',
    transactionId: '0xabc123...',
    walletAddress: mockPartner.walletAddress,
    requestedAt: '2026-03-26T10:00:00Z',
    completedAt: '2026-03-28T09:12:00Z',
  },
  {
    id: 'po_2',
    amount: 340,
    currency: 'USDT',
    status: 'processing',
    walletAddress: mockPartner.walletAddress,
    requestedAt: '2026-04-12T12:00:00Z',
  },
];

export const mockSubAffiliates: SubAffiliate[] = [
  {
    id: 'sa_1',
    name: 'Anu B.',
    email: 'anu@example.com',
    referralCount: 18,
    totalVolume: 120_400,
    overrideCommission: 402,
    status: 'active',
    joinedAt: '2025-10-11T00:00:00Z',
  },
  {
    id: 'sa_2',
    name: 'Battushig',
    email: 'bt@example.com',
    referralCount: 9,
    totalVolume: 58_200,
    overrideCommission: 198,
    status: 'active',
    joinedAt: '2026-01-05T00:00:00Z',
  },
];

export const mockSubAffiliateStats: SubAffiliateStats = {
  total: 4,
  active: 3,
  overrideEarned: 1_202,
};

export interface ActivityEntry {
  id: string;
  description: string;
  amount: number;
  timestamp: string;
}

export const mockRecentActivity: ActivityEntry[] = [
  {
    id: 'a1',
    description: 'Commission earned from USDT/BTC spot trading',
    amount: 42.5,
    timestamp: new Date(MOCK_NOW - 30 * 60_000).toISOString(),
  },
  {
    id: 'a2',
    description: 'Commission earned from ETH/USDT futures trading',
    amount: 128.0,
    timestamp: new Date(MOCK_NOW - 3_600_000).toISOString(),
  },
  {
    id: 'a3',
    description: 'Override commission from sub-affiliate Anu B.',
    amount: 18.3,
    timestamp: new Date(MOCK_NOW - 7_200_000).toISOString(),
  },
  {
    id: 'a4',
    description: 'Commission earned from BTC/USDT spot trading',
    amount: 61.9,
    timestamp: new Date(MOCK_NOW - 14_400_000).toISOString(),
  },
  {
    id: 'a5',
    description: 'Earn product commission from user u_2004',
    amount: 22.4,
    timestamp: new Date(MOCK_NOW - 86_400_000).toISOString(),
  },
];
