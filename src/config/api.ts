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

export const api = {
  partner: {
    base: BASE,
    auth: `${BASE}/auth`,
    dashboard: `${BASE}/dashboard`,
    referrals: `${BASE}/referrals`,
    links: `${BASE}/links`,
    campaigns: `${BASE}/campaigns`,
    commissions: `${BASE}/commissions`,
    payouts: `${BASE}/payouts`,
    subAffiliates: `${BASE}/sub-affiliates`,
  },
} as const;

export type ApiConfig = typeof api;
