import axios from 'axios';

import { api } from '#/config/api';

import type { PartnerResponse, PartnerTier } from '../partner/types';

/**
 * Public partner endpoints — no authentication required.
 * Used by the marketing landing page (tier table, etc.).
 */
export const getPublicTiers = async (): Promise<PartnerTier[]> => {
  const { data } = await axios.get<PartnerResponse<PartnerTier[]>>(
    api.public.tiers,
  );
  return data.body ?? [];
};
