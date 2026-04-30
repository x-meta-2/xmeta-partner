import { env } from './env';

/**
 * Centralized API endpoint registry — partner portal.
 *
 * Single base URL, one service. Per-domain path prefixes for clarity.
 *
 * Usage:
 *   import { api } from '#/config/api';
 *   baseService.get(`${api.partner.dashboard}/summary`)
 */

const BASE = env.VITE_PARTNER_API_URL;
const PARTNER = `${BASE}/partner`;
const PUBLIC = `${BASE}/public/partner`;

export const api = {
  public: {
    tiers: `${PUBLIC}/tiers`,
  },
  partner: {
    base: PARTNER,
    auth: `${PARTNER}/auth`,
    dashboard: `${PARTNER}/dashboard`,
    referrals: `${PARTNER}/referrals`,
    links: `${PARTNER}/links`,
    commissions: `${PARTNER}/commissions`,
    payouts: `${PARTNER}/payouts`,
    subAffiliates: `${PARTNER}/sub-affiliates`,
  },
} as const;

export type ApiConfig = typeof api;
