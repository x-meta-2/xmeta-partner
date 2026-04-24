import type { PartnerTier } from '../types';

export type PartnerStatus = 'pending' | 'active' | 'suspended';

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
