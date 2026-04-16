import { env } from './env';

/**
 * Centralized API endpoint registry for the partner portal.
 *
 * Primary surface: `api.partner.*`
 * Legacy `api.v3.*` / `api.xmeta.*` are temporary shims that point at the
 * partner API base until each service is migrated in Phase 3.
 */
export const api = {
  partner: {
    base: env.VITE_PARTNER_API_URL,
  },

  // TEMPORARY LEGACY SHIMS — all point at partner API base.
  v3: {
    base: env.VITE_NEW_XMETA_API_URL,
    account: env.VITE_NEW_XMETA_ACCOUNT_API_URL,
    staking: env.VITE_NEW_XMETA_STAKING_API_URL,
    config: env.VITE_NEW_XMETA_CONFIG_API_URL,
    takeAction: env.VITE_NEW_XMETA_TAKE_ACTION_API_URL,
    security: env.VITE_NEW_XMETA_SECURITY_API_URL,
  },
  xmeta: {
    open: env.VITE_API_XMETA_URL,
    security: env.VITE_API_SECURITY_URL,
  },

  base: env.VITE_API_BASE_URL,
  key: env.VITE_API_KEY,
} as const;

export type ApiConfig = typeof api;
