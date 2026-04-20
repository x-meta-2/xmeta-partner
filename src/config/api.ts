import { env } from './env';

/**
 * API endpoint registry — partner portal.
 *
 * `partner.base` is the primary. Legacy `v3.*` / `xmeta.*` shims kept
 * only because inherited auth-actions/security code still references them.
 * They all resolve to the same partner-api base URL.
 * TODO: delete legacy shims after auth-actions cleanup.
 */
const base = env.VITE_PARTNER_API_URL;

export const api = {
  partner: { base },

  // Legacy shims — remove when auth-actions is fully migrated.
  v3: {
    base,
    account: base,
    security: base,
    staking: base,
    config: base,
    takeAction: base,
  },
  xmeta: { open: base, security: base },
  key: '',
} as const;

export type ApiConfig = typeof api;
