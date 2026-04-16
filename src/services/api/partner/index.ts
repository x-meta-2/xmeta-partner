/**
 * Partner API services — one axios client, one file per domain.
 *
 * Endpoint base (in `api.partner.base`): `/api/v1/partner`
 * All responses follow `PartnerResponse<T>` envelope: `{ message, body }`.
 */
import { partnerClient } from '../client';
import type {
  Campaign,
  ChartPeriod,
  ChartPoint,
  Commission,
  CommissionBreakdown,
  DailyCommission,
  DashboardSummary,
  Partner,
  PartnerPaginated,
  PartnerPaginationInput,
  PartnerResponse,
  PartnerTier,
  Payout,
  PayoutSummary,
  Referral,
  ReferralChartPoint,
  ReferralLink,
  ReferralStats,
  SubAffiliate,
  SubAffiliateStats,
  TierProgress,
} from '#/services/types/partner.types';

const unwrap = <T>(res: { data: PartnerResponse<T> }): T | null => res.data.body;

// ---------- Partner profile ----------
export const partnerService = {
  getInfo: async () =>
    unwrap<Partner>(await partnerClient.get('/auth/info')),
  updateProfile: async (payload: Partial<Partner>) =>
    unwrap<Partner>(await partnerClient.put('/auth/profile', payload)),
  getTier: async () =>
    unwrap<PartnerTier>(await partnerClient.get('/auth/tier')),
};

// ---------- Dashboard ----------
export const dashboardService = {
  getSummary: async () =>
    unwrap<DashboardSummary>(await partnerClient.post('/dashboard/summary', {})),
  getTierProgress: async () =>
    unwrap<TierProgress>(await partnerClient.post('/dashboard/tier-progress', {})),
  getEarningsChart: async (period: ChartPeriod = '30d') =>
    unwrap<ChartPoint[]>(
      await partnerClient.post('/dashboard/earnings-chart', { period }),
    ),
  getReferralChart: async (period: ChartPeriod = '30d') =>
    unwrap<ReferralChartPoint[]>(
      await partnerClient.post('/dashboard/referral-chart', { period }),
    ),
};

// ---------- Referrals ----------
export const referralsService = {
  list: async (params: PartnerPaginationInput = {}) =>
    unwrap<PartnerPaginated<Referral>>(
      await partnerClient.post('/referrals/list', params),
    ),
  detail: async (id: string) =>
    unwrap<Referral>(await partnerClient.get(`/referrals/detail/${id}`)),
  getStats: async () =>
    unwrap<ReferralStats>(await partnerClient.get('/referrals/stats')),
};

// ---------- Links ----------
export const linksService = {
  list: async (params: PartnerPaginationInput = {}) =>
    unwrap<PartnerPaginated<ReferralLink>>(
      await partnerClient.post('/links/list', params),
    ),
  create: async (payload: { code: string }) =>
    unwrap<ReferralLink>(await partnerClient.post('/links/create', payload)),
  update: async (id: string, payload: Partial<ReferralLink>) =>
    unwrap<ReferralLink>(await partnerClient.put(`/links/${id}`, payload)),
  delete: async (id: string) =>
    unwrap<null>(await partnerClient.delete(`/links/${id}`)),
};

// ---------- Campaigns ----------
export const campaignsService = {
  list: async (params: PartnerPaginationInput = {}) =>
    unwrap<PartnerPaginated<Campaign>>(
      await partnerClient.post('/campaigns/list', params),
    ),
  create: async (payload: Partial<Campaign>) =>
    unwrap<Campaign>(await partnerClient.post('/campaigns/create', payload)),
  detail: async (id: string) =>
    unwrap<Campaign>(await partnerClient.get(`/campaigns/detail/${id}`)),
  update: async (id: string, payload: Partial<Campaign>) =>
    unwrap<Campaign>(await partnerClient.put(`/campaigns/${id}`, payload)),
  delete: async (id: string) =>
    unwrap<null>(await partnerClient.delete(`/campaigns/${id}`)),
};

// ---------- Commissions / Earnings ----------
export const commissionsService = {
  list: async (params: PartnerPaginationInput = {}) =>
    unwrap<PartnerPaginated<Commission>>(
      await partnerClient.post('/commissions/list', params),
    ),
  breakdown: async () =>
    unwrap<CommissionBreakdown>(
      await partnerClient.post('/commissions/breakdown', {}),
    ),
  dailySummary: async () =>
    unwrap<DailyCommission[]>(
      await partnerClient.post('/commissions/daily-summary', {}),
    ),
};

// ---------- Payouts ----------
export const payoutsService = {
  list: async (params: PartnerPaginationInput = {}) =>
    unwrap<PartnerPaginated<Payout>>(
      await partnerClient.post('/payouts/list', params),
    ),
  detail: async (id: string) =>
    unwrap<Payout>(await partnerClient.get(`/payouts/detail/${id}`)),
  getPending: async () =>
    unwrap<PayoutSummary>(await partnerClient.get('/payouts/pending')),
  request: async (payload: { amount: number; walletAddress: string }) =>
    unwrap<Payout>(await partnerClient.post('/payouts/request', payload)),
};

// ---------- Sub-affiliates ----------
export const subAffiliatesService = {
  list: async (params: PartnerPaginationInput = {}) =>
    unwrap<PartnerPaginated<SubAffiliate>>(
      await partnerClient.post('/sub-affiliates/list', params),
    ),
  invite: async (payload: { email: string; name?: string }) =>
    unwrap<SubAffiliate>(
      await partnerClient.post('/sub-affiliates/invite', payload),
    ),
  getStats: async () =>
    unwrap<SubAffiliateStats>(
      await partnerClient.post('/sub-affiliates/stats', {}),
    ),
};
