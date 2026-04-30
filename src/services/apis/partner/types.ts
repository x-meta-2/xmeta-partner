/**
 * Shared partner types — used across multiple partner pages.
 *
 * Page-specific entities (Referral, Commission, Payout, etc.) live in
 * `apis/partner/{page}/types.ts`.
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

// ---------- Tier (used by partner profile, dashboard, performance) ----------

export type TierName = 'Standard' | 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

export interface PartnerTier {
  id: string;
  name: TierName;
  level: number;
  commissionRate: number;
  minActiveClients: number;
  minVolume: number;
  maxVolume: number | null;
  isDefault: boolean;
  color: string;
}

/** Tier requirements for display & auto-upgrade logic */
export const TIER_REQUIREMENTS: Record<
  TierName,
  {
    commission: number;
    minActiveClients: number;
    minVolume: number;
    maxVolume: number | null;
  }
> = {
  Standard: {
    commission: 0.2,
    minActiveClients: 0,
    minVolume: 0,
    maxVolume: 15_000_000,
  },
  Bronze: {
    commission: 0.25,
    minActiveClients: 1,
    minVolume: 15_000_000,
    maxVolume: 30_000_000,
  },
  Silver: {
    commission: 0.3,
    minActiveClients: 3,
    minVolume: 30_000_000,
    maxVolume: 150_000_000,
  },
  Gold: {
    commission: 0.35,
    minActiveClients: 8,
    minVolume: 150_000_000,
    maxVolume: 450_000_000,
  },
  Diamond: {
    commission: 0.4,
    minActiveClients: 10,
    minVolume: 450_000_000,
    maxVolume: null,
  },
};

// ---------- Helper to unwrap PartnerResponse envelope ----------

export const unwrapPartner = <T>(res: { data: PartnerResponse<T> }): T | null =>
  res.data.body;
